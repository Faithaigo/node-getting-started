const path = require('path');

const express = require('express');

const { getProducts, getAllProducts, getCart, getCheckout, getOrders, getProduct, postCart} = require('../controllers/shop');

const router = express.Router();

router.get('/', getProducts);

router.get('/cart', getCart);
router.post('/cart', postCart)

router.get('/orders', getOrders);

router.get('/products', getAllProducts);
router.get('/products/:productId', getProduct)
router.get('/checkout', getCheckout);

module.exports = router;
