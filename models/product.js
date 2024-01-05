const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename), 'data','products.json')


const getProductsFromFile = (cb) =>{

    fs.readFile(p, (err, fileContent)=>{
        if(err){
          return cb([])
        }
        cb(JSON.parse(fileContent))
    })
}

module.exports = class Product{
    constructor(title,imageUrl, description, price){
        this.title = title
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    save(){
        this.id = Math.random().toString();
        console.log('product',this)
        getProductsFromFile((products)=>{
            products.push(this)
            fs.writeFile(p,JSON.stringify(products),(err)=>{
             console.log(err)
            })//convert js object/array into json
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

}