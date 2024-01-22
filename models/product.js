const db = require('../util/database')

const Cart = require('./cart')



module.exports = class Product{
    constructor(id,title,imageUrl, description, price){
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    save(){
       return db.execute("INSERT INTO products(title, price, description, imageUrl) VALUES(?,?,?,?)",
        [this.title, this.price, this.description, this.imageUrl])
    }

    //static makes you call a method directly on a class
    static fetchAll(){ 
       return db.execute('SELECT * FROM products')
    }

    static findById(id){
        // ? lets mysql inject the value
      return db.execute('SELECT * FROM products WHERE products.id = ?',[id])
    }

    static deleteProduct(id){

    }

}