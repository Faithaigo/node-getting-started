
const mongodb = require('mongodb')
const {getDb} = require('../util/database')

class Product{
    constructor(title, price, description, imageUrl, id, userId){
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
        this._id = id ?  new mongodb.ObjectId(id) : null
        this.userId = userId
    }

    save(){
        const db = getDb();
        let dbOp;
        if(this._id){
            /**
             * Update product
             * updateOne doesn't replace that's why we use $set to set the values
             * this is a new object
             */
             dbOp =  db.collection('products').updateOne({_id: this._id}, {
                $set:this
             })
        }else{
          dbOp =  db.collection('products').insertOne(this)
        }
        return dbOp.then(result=>{
            console.log('inserted product', result)
        }).catch(err=>{
            console.log(err)
        }) 
        
    }

    static fetchAll(){
        /**
         * Find returns a cursor - object by mongodb which allows us to go through our documents steps by steps
         * toArray converts documents to a javascript array
         */

         const db = getDb();
        return db.collection('products').find().toArray().then(products=>{
            console.log('products', products)
            return products
        }).catch(err=>{
            console.log(err)
        })
    }

    static fetchById(product_id){
        /**
         * Find returns a cursor - object by mongodb which allows us to go through our documents steps by steps
         * next() returns the last document
         */
         const db = getDb();
        return db.collection('products').find({_id: new mongodb.ObjectId(product_id)}).next().then(product=>{
            console.log('single product', product)
            return product
        }).catch(err=>{
            console.log(err)
        })
    }

    static deleteById(prodId){
        const db = getDb()
        return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId)}).then(()=>{
            console.log('Deleted')
        }).catch(err=>{
            console.log(err)
        })
    }
}


module.exports = Product;
