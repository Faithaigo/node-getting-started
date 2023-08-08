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
    constructor(title){
        this.title = title
    }

    save(){
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

}