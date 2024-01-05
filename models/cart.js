const fs = require('fs')
const path = require('path')

const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'cart.json')

module.exports = class Cart{
    static addProduct(id, productPrice){
        //Fetch the previous cart
        fs.readFile(p, (err, fileContent)=>{
            let cart = {products:[], totalPrice:0}
            if (!err){
              cart = JSON.parse(fileContent)
            }
            //Analyze the =>Find the existing product
            const existingProductIndex = cart.products.findIndex(prod=>prod.id === id);
            const existingProduct = cart.products[existingProductIndex]
            let updatedProduct;
            //Add new product/ increase quantity
            if (existingProduct){
                updatedProduct = {...existingProduct}
                updatedProduct.qty = updatedProduct.qty + 1
                cart.products = [...cart.products]
                //replace the existing product at a given index with the new product
                cart.products[existingProductIndex] = updatedProduct
            }else {
                updatedProduct = {id:id, qty:1}
                //add the new product to the existing products in the cart
                cart.products = [...cart.products,updatedProduct]
            }

            //get the old cart totalPrice and add it to the price of the current product
            cart.totalPrice = Number(cart.totalPrice) + Number(productPrice)
            fs.writeFile(p, JSON.stringify(cart),err=>{
                console.log(err)
            })
        })


    }

    static deleteProduct(id, productPrice){
        fs.readFile(p, (err, fileContent)=>{
            if (err){
                return
            }
            let cart =  JSON.parse(fileContent)
            let updatedCart = {...cart}
            const product = updatedCart.products.find(prod => prod.id === id)
            let productQty = product.qty
            updatedCart.products = updatedCart.products.filter(prod=>prod.id !== id)
            updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty
            fs.writeFile(p, JSON.stringify(updatedCart),err=>{
                console.log(err)
            })
        })
    }
}