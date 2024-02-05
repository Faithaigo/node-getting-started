const Product = require('../models/product')
const Order =  require('../models/order')



exports.getProducts = (req, res, next) => {
    Product.findAll().then(products=>{
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    }).catch(err=>{
        console.log(err)
    })

   
  }
  exports.getProduct = (req, res, next) =>{
    const prodId = req.params.productId;
    /** Alternative approach */
    // Product.findAll({where:{id:prodId}}).then(product=>{
    //     res.render('shop/product-detail',{
    //         pageTitle:product[0].title,
    //         product:product[0],
    //         path:'/products'
    //     })
    // }).catch(err=>{
    //     console.log(err)
    // })
    Product.findByPk(prodId).then((product)=>{
        res.render('shop/product-detail',{
            pageTitle:product.title,
            product:product,
            path:'/products'
        })
    }).catch(err=>console.log(err))
    res.redirect('/')
}

exports.getCart = (req, res, next) => {
    req.user.getCart().then(cart=>{
        return cart.getProducts().then(products=>{
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products:products
            });
        }).catch(err=>{
            console.log(err)
        })
    }).catch(err=>{
        console.log(err)
    })

  }
exports.postCart = (req,res,next) =>{
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1
    req.user.getCart().then(cart=>{
        fetchedCart = cart
        return cart.getProducts({where:{id:productId}})
    }).then(products=>{
        let product;
        if(products.length > 0){
            product = products[0]
        }
       
        if(product){
            const oldQuantity = product.cartItem.quantity
            newQuantity = oldQuantity + 1
            return product
        }
        return Product.findByPk(productId)
    }).then(product=>{
        return fetchedCart.addProduct(product,{through:{quantity:newQuantity}})
    }).then(()=>{
        res.redirect('/cart')
    }).catch(err=>{
        console.log(err)
    })
//   Product.findById(productId, (product)=>{
//       Cart.addProduct(productId, product.price)
//   })
//     res.redirect('/cart')
}

exports.deleteCartItem = (req, res, next) =>{
    const productId = req.body.productId;
    
    req.user.getCart().then(cart=>{
        return cart.getProducts({where:{id:productId}})
    }).then(products=>{
        const product = products[0]
        return product.cartItem.destroy()
    }).then(result=>{
        res.redirect('/cart')
    }).catch(err=>{
        console.log(err)
    })


}
exports.postOrders = (req, res, next) =>{
    let fetchedCart;
    req.user.getCart().then(cart=>{
        fetchedCart = cart
        return cart.getProducts()
    }).then(products=>{
        return req.user.createOrder().then(order=>{
            return order.addProducts(products.map(product=>{
                console.log(product.cartItem)
                product.orderItem = {quantity:product.cartItem.quantity}
                return product;
            }))
        })
    }).then(result=>{
       return fetchedCart.setProducts(null)
    }).then(result=>{
        res.redirect('/orders')
    }).catch(err=>{
        console.log(err)
    })
}
exports.getOrders = (req, res, next) => {
    req.user.getOrders({include:['products']}).then(orders=>{
        console.log(orders)
        res.render('shop/orders', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders
        });
    }).catch(err=>{
        console.log(err)
    })

}

exports.getAllProducts = (req, res, next) => {
    Product.findAll().then(products=>{
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
        });
    }).catch(err=>{
        console.log(err)
    })
}

  exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  }