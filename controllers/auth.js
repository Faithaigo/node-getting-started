const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const User = require('../models/user');

/**
 * Tell nodemailer how the emails will be delivered
 */
const transporter = nodemailer.createTransport(sendgridTransport({
  auth:{
    api_key:'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'
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
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({email:email})
    .then(user => {
      if(!user){
        req.flush('error','Invalid email or password')
        return res.redirect('/login')
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
        req.flush('error','Invalid email or password')
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
  User.findOne({email:email}).then(userDoc=>{
    if(userDoc){
      req.flush('error','Email exists already, please pick a different one')
      return res.redirect('/signup')
    }
    return bcrypt.hash(password, 12).then(hashPassword=>{
      const user = new User({email, password:hashPassword, cart:{items:[]}})
      return user.save()
    })
  }).then(result=>{
    res.redirect('/login')
    return transporter.sendMail({
      to:email,
      from:'aigofaith@gmail.com',
      subject:'Sign up succeeded!',
      html: '<h1>You successfully signed up!</h2>'
    }).catch(err=>{
      console.log(err)
    }) 
  }).catch(err=>{
    console.log(err)
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
