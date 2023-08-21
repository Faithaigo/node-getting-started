const path = require('path');

const express = require('express');

const { getProducts, getAllProducts, getCart, getCheckout } = require('../controllers/shop');

const router = express.Router();

router.get('/', getProducts);

router.get('/cart', getCart);

router.get('/products', getAllProducts);
router.get('/checkout', getCheckout);

module.exports = router;
