const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) //pass an argument to a function
/**
 * protect against csrf attacks
 */
const csrf =  require('csurf')

/**
 * Store temporary messages in a session
 */

const flash =  require('connect-flash')


const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const MONGOBD_URI = 'mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/shop?w=majority'  

const store = new MongoDBStore({
  uri:MONGOBD_URI,
  collection:'sessions'
})


const csrfProtection = csrf()



app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
/**
 * secret - used for assigning the #
 * resave - The session will not be saved on every request unless something on the session changed
 */
app.use(session({secret: 'my secret', resave:false, saveUninitialized:false, store}))
app.use(csrfProtection)
app.use(flash())


app.use((req, res, next) => {
  if(!req.session.user){
    return next()
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

//set local variables that are passed in the views
app.use((req, res, next)=>{
  res.locals.isAuthenticated =  req.session.isLoggedIn,
  res.locals.csrfToken = req.csrfToken()
  next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGOBD_URI)
  .then(result => {
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
