const mongoose = require('mongoose')
const Order = require('./order')

const Schema = mongoose.Schema

const userSchema = new Schema({
  name:{
    type: String,
    required:true
  },
  email:{
    type: String,
    required:true
  },
  cart:{
    items:[
      {productId:{
      type: Schema.Types.ObjectId,
      ref:'Product',
      required:true
    }, quantity:{
      type: Number,
      required:true
    }}
  ]
  }
})

/**
 * Define methods using mongoose
 */
userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp=>{
      return cp.productId.toString() === product._id.toString()
    })

    let newQuantity = 1
    const updatedCartItems = [...this.cart.items]
    
    if(cartProductIndex >= 0){
      newQuantity = this.cart.items[cartProductIndex].quantity + 1
      updatedCartItems[cartProductIndex].quantity = newQuantity
    }else{
      updatedCartItems.push({productId: product._id, quantity:newQuantity})
    }

    const updatedCart = {items:updatedCartItems}
    this.cart = updatedCart
    return this.save()
}

userSchema.methods.removeFromCart = function(prodId){
  const updatedCartItem = this.cart.items.filter(item => item.productId.toString() !== prodId.toString())
  this.cart.items = updatedCartItem
  return this.save()

}

userSchema.methods.clearCart = function(){
  this.cart = {items:[]}
  return this.save()

}



module.exports = mongoose.model('User', userSchema)


// const mongodb = require('mongodb')
// const {getDb} = require('../util/database')

// const ObjectId = mongodb.ObjectId
// class User{
//   constructor(username,email, cart, id){
//     this.username = username
//     this.email = email
//     this.cart = cart
//     this._id = id
//   }

//   save(){
//     const db = getDb()
//     return db.collection('users').insertOne(this)
//     .then(()=>{
//       console.log('User created')
//     }).catch(err=>{
//       console.log(err)
//     })
//   }

//   addToCart(product){
//     const cartProductIndex = this.cart.items.findIndex(cp=>{
//       return cp.productId.toString() === product._id.toString()
//     })

//     let newQuantity = 1
//     const updatedCartItems = [...this.cart.items]
    
//     if(cartProductIndex >= 0){
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1
//       updatedCartItems[cartProductIndex].quantity = newQuantity
//     }else{
//       updatedCartItems.push({productId: new ObjectId(product._id), quantity:newQuantity})
//     }

//     const updatedCart = {items:updatedCartItems}
//     const db = getDb()
//     return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
//       $set:{cart:updatedCart}
//     })
//   }

//   getCart(){
//     const db = getDb()
    
//     /**
//      * Returns all the products with ids that match the query
//      */
//     const productIds = this.cart.items.map(item=>item.productId)
//     return db.collection('products').find({_id: {$in: productIds}}).toArray()
//     .then(products=>{
//       if(products.length === 0 && this.cart.items.length > 0){
//         this.cart = {items:[]}
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
//           $set:{cart:{items: []}}
//         })
//       }
//       if(products.length !== this.cart.items.length){
//         const updatedProducts = this.cart.items.filter(item=>products.map(prod=> prod._id.toString()).includes(item.productId.toString()))
//         this.cart = {items:updatedProducts}
//         return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
//           $set:{cart:{items: updatedProducts}}
//         })
//       }
//       return products.map(p=>({
//         ...p, quantity: this.cart.items.find(i=> i.productId.toString() === p._id.toString()).quantity
//       }))
//     }).catch(err=>{
//       console.log(err)
//     })
//   }

//   deleteItemFromCart(prodId){
//     const updatedCartItem = this.cart.items.filter(item => item.productId.toString() !== prodId.toString())
//     const db = getDb()
//     return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
//       $set:{cart:{items: updatedCartItem}}
//     })
//   }

//   addOrder(){
//     const db = getDb()
//     /**
//      * We don't update the previous orders incase the product data changes
//      */
//     return this.getCart().then(products=>{
//       const order = {
//         items:products,
//         user:{
//           _id: new ObjectId(this._id),
//           username:this.username
//         }
//       }
//       return db.collection('orders').insertOne(order)
//     })
//     .then(result=>{
//       this.cart = {items:[]}
//       return db.collection('users').updateOne({_id: new ObjectId(this._id)}, {
//         $set:{cart:{items: []}}
//       })
//     }).catch(err=>{
//       console.log(err)
//     })
//   }

//   getOrders(){
//     const db = getDb()
//     return db.collection('orders').find({'user._id': new ObjectId(this._id)}).toArray()
//   }

//   static findById(userId){
//     const db = getDb()
//     return db.collection('users').findOne({_id: new ObjectId(userId)})
//     .then((user)=>{
//       return user
//     }).catch(err=>{
//       console.log(err)
//     })
//   }
// }

// module.exports = User;



