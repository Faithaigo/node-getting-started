const Product = require('../models/product')
const Cart =  require('../models/cart')



exports.getProducts = (req, res, next) => {
    Product.fetchAll((products)=>{
        res.render('shop', {
            prods: products,
            pageTitle: 'Shop',
            path: '/'
          });
    })
   
  }
  exports.getProduct = (req, res, next) =>{
    const prodId = req.params.productId;
    Product.findById(prodId, product=>{
        res.render('shop/product-detail',{
            pageTitle:'My Product',
            product,
            path:'/products'
        })
    })
    // res.redirect('/')
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts = []
            for (product of products){
                const cartProduct = cart.products.find(item=>item.product_id === product.product_id)
                if (cartProduct){
                    cartProducts.push({productData:product, qty:cartProduct.qty})
                }
            }
            res.render('shop/cart', {
                pageTitle: 'Your Cart',
                path: '/cart',
                products:cartProducts
            });
        })

    })

  }
exports.postCart = (req,res,next) =>{
    const productId = req.body.productId;
  Product.findById(productId, (product)=>{
      Cart.addProduct(productId, product.price)
  })
    res.redirect('/cart')
}

exports.deleteCartItem = (req, res, next) =>{
    const productId = req.body.productId;
    Product.findById(productId, product=>{
        Cart.deleteProduct(productId, product.price)
        res.redirect('/cart')
    })


}
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        pageTitle: 'Your Orders',
        path: '/orders',
    });
}

exports.getAllProducts = (req, res, next) => {

  Product.fetchAll((products)=>{
    res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
  })
}

  exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
      pageTitle: 'Checkout',
      path: '/checkout',
    });
  }