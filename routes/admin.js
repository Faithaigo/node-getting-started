const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin')

const router = express.Router();

const products = [];

// /admin/add-product => GET
router.get('/add-product', adminController.getAddProduct); //refrence to the funnction doesn't execcute all the time but it's executed when it's needed

// /admin/add-product => POST
router.post('/add-product', adminController.postAddproduct);

router.get('/products', adminController.getAdminProducts);

module.exports = router;
