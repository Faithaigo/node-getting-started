const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) //pass an argument to a function

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

const MONGOBD_URI = 'mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/shop?w=majority'  

const store = new MongoDBStore({
  uri:MONGOBD_URI,
  collection:'sessions'
})

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

// app.use((req, res, next) => {
//   User.findById('65c5b6d1c84c0e600dfc08ef')
//     .then(user => {
//       req.user = user;
//       next();
//     })
//     .catch(err => console.log(err));
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGOBD_URI)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
