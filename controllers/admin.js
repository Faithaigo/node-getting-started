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
    //Product is the name of the model, createProduct comes as a resul of associations
    req.user.createProduct({
        title,
        price,
        imageUrl,
        description,
    }).then(result=>{
        console.log('Created product')
        res.redirect('/admin/products')
    }).catch(err=>{
        console.log(err)
    })

    //alternative way
    // Product.create({
    //     title,
    //     price,
    //     imageUrl,
    //     description,
    //     userId:req.user.id
    // }).then(result=>{
    //     console.log('Created product')
    //     res.redirect('/admin/products')
    // }).catch(err=>{
    //     console.log(err)
    // })
    // const product = new Product(null,title, imageUrl, description, price)
    // product.save().then(()=>{
    //     //send response
    //     res.redirect('/');
    // }).catch(err=>console.log(err))

    
  }

exports.getEditProduct = (req, res, next) => {
    //add optional query parameters, can be used for example keeping a filter that a user set on the page
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/')
    }
    const prodId = req.params.productId
    //get products for a logged in user
    req.user.getProducts({where:{id:prodId}}).then(products=>{
        const product = products[0]
        if (!product){
            return res.redirect('/')
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit  Product',
            path: '/admin/edit-product',
            editing:editMode,
            product
        });
    }).catch(err=>{
        console.log(err)
    })

    // Product.findByPk(prodId).then(product=>{
    //     if (!product){
    //         return res.redirect('/')
    //     }
    //     res.render('admin/edit-product', {
    //         pageTitle: 'Edit  Product',
    //         path: '/admin/edit-product',
    //         editing:editMode,
    //         product
    //     });
    // }).catch(err=>{
    //     console.log(err)
    // })
}

exports.postEditProduct = (req, res, next) =>{
    const prodId = req.body.productId
    const updated_title = req.body.title
    const updated_imageUrl = req.body.imageUrl
    const updated_description = req.body.description
    const updated_price = req.body.price
    Product.findByPk(prodId).then(product=>{
        product.title = updated_title
        product.price = updated_price
        product.imageUrl = updated_imageUrl
        product.description = updated_description
        return product.save()
    }).then(result=>{
        console.log('Updated Product')
        res.redirect('/admin/products')
    }).catch(err=>{
        console.log(err)
    })
  
}

exports.deleteProduct = (req, res, next) =>{
    const prodId = req.body.productId
    Product.findByPk(prodId).then(product=>{
        return product.destroy()
    }).then(result=>{
        console.log('Product deleted')
        res.redirect('/admin/products')
    }).catch(err=>{
        console.log(err)
    })
}

exports.getAdminProducts = (req, res, next) => {
    //get products for a spcific user
    req.user.getProducts().then(products=>{
        res.render('admin/products', {
            prods:products,
            pageTitle: 'Admin Products',
            path: '/admin/products',
        });
    }).catch(err=>{
        console.log(err)
    })

    // Product.findAll().then(products=>{
    //     res.render('admin/products', {
    //         prods:products,
    //         pageTitle: 'Admin Products',
    //         path: '/admin/products',
    //     });
    // }).catch(err=>{
    //     console.log(err)
    // })
  }