const path = require('path');

const express = require('express');

const { getProducts, getAllProducts, getCart, getCheckout, getOrders} = require('../controllers/shop');

const router = express.Router();

router.get('/', getProducts);

router.get('/cart', getCart);

router.get('/orders', getOrders);

router.get('/products', getAllProducts);
router.get('/checkout', getCheckout);

module.exports = router;
