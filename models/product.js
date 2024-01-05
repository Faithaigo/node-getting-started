const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data','products.json')

const Cart = require('./cart')


const getProductsFromFile = (cb) =>{

    fs.readFile(p, (err, fileContent)=>{
        if(err){
          return cb([])
        }
        cb(JSON.parse(fileContent))
    })
}

module.exports = class Product{
    constructor(id,title,imageUrl, description, price){
        this.id = id
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    save(){

        console.log('product',this)
        getProductsFromFile((products)=>{
            if (this.id){
                const existingProductIndex = products.findIndex(prod=>prod.id === this.id)
                let updatedProducts = [...products]
                updatedProducts[existingProductIndex] = this
                fs.writeFile(p,JSON.stringify(updatedProducts),(err)=>{
                    console.log(err)
                })
            }else{
                this.id = Math.random().toString();
                products.push(this)
                fs.writeFile(p,JSON.stringify(products),(err)=>{
                    console.log(err)
                })//convert js object/array into json
            }

        })
    }

    //static makes you call a method directly on a class
    static fetchAll(cb){ //cb is a callback that executes once fetchAll is done executing
        getProductsFromFile(cb)
    }

    static findById(id, cb){
        getProductsFromFile(products=>{
            const product = products.find(p=>p.id === id)
            cb(product)
        })
    }

    static deleteProduct(id){
        getProductsFromFile(products=>{
            const product = products.find(prod=>prod.id === id)
            const remainingProducts = products.filter(p=>p.id !== id)
            fs.writeFile(p,JSON.stringify(remainingProducts),(err)=>{
                if (!err){
                    Cart.deleteProduct(id, product.price)
                }
            })
        })
    }

}