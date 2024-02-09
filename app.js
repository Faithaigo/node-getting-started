const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');


const User = require('./models/user')


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const mongoose = require('mongoose')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('65c5b6d1c84c0e600dfc08ef')
    .then(user => {
      /**
       * user is a full mongoose model
       */
      req.user = user
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

const dbUri = "mongodb+srv://aigofaith:WxkHZ0KA7lwk41Xf@cluster0.pkwhwvs.mongodb.net/shop?retryWrites=true&w=majority"

mongoose.connect(dbUri).then(()=>{
  User.findOne().then(user=>{
    if(!user){
      const user = new User({
          name:'Faith',
          email:'faith@gmail.com',
          cart:{
            items:[]
          }
      })
      user.save()      
    }
  })
 
  app.listen(5000)
}).catch(err=>{
  console.log(err)
})



