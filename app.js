const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./util/database")
const Product = require('./models/product')
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404Page } = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404Page);

/** Relationships */

Product.belongsTo(User,{
    constraints:true, onnDelete:'CASCADE'
})

/** alternative relationship */
User.hasMany(Product)

//syncs models to the db, force overrides tables
sequelize
// .sync({force:true})
.sync()
.then(result=>{
    return User.findByPk(1)
    // console.log(result)
   
})
.then(user=>{
    if(!user){
        return User.create({name:'Faith', email:'test@gmail.com'})
    }
    return Promise.resolve(user)
})
.then(user=>{
    // console.log(user)
    app.listen(5000);
})
.catch(err=>{
    console.log(err)
})


