const User = require('../models/user')

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[2]?.trim().split('=')[1] === 'true'
  console.log(req.session)
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  /**
   * Max-Age is thee number in seconds how long that cookie should stay around
   * Secure sets the cookie if the page is served via https
   * HttpOnly- can't access the value through client side javascript, protects us from cross-site scripting
   */
  // res.setHeader('Set-Cookie','isLoggedIn=true; Secure')


  User.findById('65c5b6d1c84c0e600dfc08ef')
  .then(user => {
    req.session.isLoggedIn = true
    req.session.user = user;
    req.session.save(err=>{
      console.log(err);
      res.redirect('/')
    })
   
  })
  .catch(err => console.log(err));

  /**
   * redirection created a brand new request
   */
 
};

exports.postLogout = (req, res, next) =>{
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
  })
}
