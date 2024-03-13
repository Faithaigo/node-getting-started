const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
const { validationResult} = require('express-validator') //gather all the errors the validation middleware in the routes might have thrown


/**
 * Create secure unique random values
 */
const crypto = require('crypto')

const User = require('../models/user');

/**
 * Tell nodemailer how the emails will be delivered
 */

const apiKey = 'add sendgrid api key here'
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:apiKey
  }
}))

exports.getLogin = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message
  }else{
    message = null
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: message,
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message
  }else{
    message = null
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: message,
    oldInput:{email:'', password:'', confirmPassword:''},
    validationErrors:[]

  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput:{email, password},

    });
  }
  User.findOne({email:email})
    .then(user => {
      if(!user){
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password',
          oldInput:{email, password},
        });
      }
      //compare passwords
      bcrypt.compare(password, user.password).then((doMatch)=>{
        if(doMatch){
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save(err => {
            console.log(err);
            res.redirect('/');
          });
        }
        req.flash('error','Invalid email or password')
        res.redirect('/login')
      }).catch(err=>{
        console.log(err)
        res.redirect('/login')
      })
    
    })
    .catch(err => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  const confirmPassword = req.body.confirmPassword
  /**
   * call validation result on the request becuase the middleware will pass the errors in the errors object
   */
  const errors = validationResult(req)
 
  if(!errors.isEmpty()){
    /**
     * status 422 is for invalid errors
     * Render the page again if there is any error
     */
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput:{email, password, confirmPassword:req.body.confirmPassword},
      validationErrors:errors.array()
    })
  }
  bcrypt.hash(password, 12)
  .then(hashPassword=>{
    const user = new User({email, password:hashPassword, cart:{items:[]}})
    return user.save()
  })
  .then(result=>{
    res.redirect('/login')
    return transporter.sendMail({
      to:email,
      from:'aigofaith@gmail.com',
      subject:'Sign up succeeded!',
      html: '<h1>You successfully signed up!</h2>'
    })
  })
  .catch(err=>{
    console.log(err)
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error')
  if(message.length > 0){
    message = message
  }else{
    message = null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset Password',
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) =>{
  crypto.randomBytes(32, (err, buffer)=>{
    if(err){
      console.log(err)
      return res.redirect('/reset')
    }
    const token = buffer.toString('hex')
    User.findOne({email:req.body.email}).then(user=>{
      if(!user){
        req.flash('error', 'No account with that email found')
        return res.redirect('/reset')
      }
      user.resetToken = token
      user.resetTokenExpiration = Date.now() + 3600000
      return user.save()
    }).then(result=>{
      res.redirect('/')
      transporter.sendMail({
        to:req.body.email,
        from:'aigofaith@gmail.com',
        subject:'Password Reset!',
        html: `
        <p>You requested a password reset.</p>
        <p>Click this <a href="http://localhost:5000/reset/${token}">link</a> to set a new password.</p>
        `
      }).catch(err=>{
        console.log(err)
      }) 
    }).catch(err=>{
      console.log(err)
    })
  })
}

exports.getNewPassword = (req, res, next) => {
  const token  = req.params.token;

  User.findOne({resetToken:token,resetTokenExpiration:{$gt:Date.now()}}).then(user=>{
    let message = req.flash('error')
    if(message.length > 0){
      message = message
    }else{
      message = null
    }
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
      errorMessage: message,
      userId:user._id.toString(),
      passwordToken:token
    });
  }).catch(err=>{
    console.log(err)
  })
};

exports.postNewPassword = (req, res, next) =>{
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({resetToken:passwordToken,resetTokenExpiration:{$gt:Date.now()}, _id:userId})
  .then(user=>{
    resetUser = user
    return bcrypt.hash(newPassword, 12)
  }).then(hashedPassword=>{
    resetUser.password = hashedPassword
    resetUser.resetToken = null
    resetUser.resetTokenExpiration = undefined
    return resetUser.save()
  }).then(result=>{
    res.redirect('/login')
  }).catch(err=>{
    console.log(err)
  })
}