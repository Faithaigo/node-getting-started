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
    res.render('shop/cart', {
      pageTitle: 'Your Cart',
      path: '/cart',
    });
  }
exports.postCart = (req,res,next) =>{
    const productId = req.body.productId;
  Product.findById(productId, (product)=>{
      Cart.addProduct(productId, product.price)
  })
    res.redirect('/cart')
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