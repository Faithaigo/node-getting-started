const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require("./util/database")
const Product = require('./models/product')
const User = require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404Page } = require('./controllers/error');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//registers the function as middlware for incoming requests. Only runs when we start our server
app.use((req, res, next)=>{
    User.findByPk(1).then(user=>{
        //store user in the request object
        console.log(user)
        req.user = user
        next()
    }).catch(err=>{
        console.log(err)
    })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404Page);



/** Relationships */

Product.belongsTo(User,{
    constraints:true, onnDelete:'CASCADE'
})

/** alternative relationship */
User.hasMany(Product)

/** One-to-One relationship */
User.hasOne(Cart)
Cart.belongsTo(User)

//Many-to-Many relations should have a single table that connects them
//through tells sequelize which model to use as an inbetween table
Cart.belongsToMany(Product,{through:CartItem})
Product.belongsToMany(Cart,{through:CartItem})


/** One-to-Many relationship */

Order.belongsTo(User)
User.hasMany(Order)

//Many-to-Many relations should have a single table that connects them
//through tells sequelize which model to use as an inbetween table
Order.belongsToMany(Product,{through:OrderItem})
// Product.belongsToMany(Order,{through:OrderItem})

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
    //value automatically wrapped in a new promise
    return user

})
.then(user=>{
    // console.log(user)
    return user.createCart()
    
}).then(cart=>{
    // console.log(cart)
    app.listen(5000);
})
.catch(err=>{
    console.log(err)
})


