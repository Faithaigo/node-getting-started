const Product = require('../models/product')


exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing:false
    });
  }


exports.postAddProduct = (req, res, next) => {
    const title = req.body.title
    const imageUrl = req.body.imageUrl
    const description = req.body.description
    const price = req.body.price
    const product = new Product(null,title, imageUrl, description, price)
    product.save().then(()=>{
        //send response
        res.redirect('/');
    }).catch(err=>console.log(err))

    
  }

exports.getEditProduct = (req, res, next) => {
    //add optional query parameters, can be used for example keeping a filter that a user set on the page
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/')
    }
    const prodId = req.params.productId
    Product.findById(prodId, product=>{
        if (!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit  Product',
            path: '/admin/edit-product',
            editing:editMode,
            product
        });
    })

}

exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId
    const updated_title = req.body.title
    const updated_imageUrl = req.body.imageUrl
    const updated_description = req.body.description
    const updated_price = req.body.price
    const updatedProduct = new Product(prodId,updated_title, updated_imageUrl, updated_description, updated_price)
    updatedProduct.save()
    res.redirect('/')
}

exports.deleteProduct = (req, res, next) =>{
    const prodId = req.body.productId
    Product.deleteProduct(prodId)
    res.redirect('/admin/products')
}

exports.getAdminProducts = (req, res, next) => {
    Product.fetchAll(products=>{
        res.render('admin/products', {
            prods:products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    })

  }