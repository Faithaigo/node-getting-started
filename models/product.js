
const mongodb = require('mongodb')
const {getDb} = require('../util/database')

class Product{
    constructor(title, price, description, imageUrl){
        this.title = title
        this.price = price
        this.description = description
        this.imageUrl = imageUrl
    }

    save(){
        const db = getDb();
        return db.collection('products').insertOne(this).then(result=>{
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
}


module.exports = Product;
