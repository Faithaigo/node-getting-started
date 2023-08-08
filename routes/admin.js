const path = require('path');

const express = require('express');

const productsController = require('../controllers/products')

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct); //refrence to the funnction doesn't execcute all the time but it's executed when it's needed

// /admin/add-product => POST
router.post('/add-product', productsController.postAddproduct );

module.exports = router;
