const path = require('path');
const adminController = require(path.join('..', 'controllers', 'admin.js'));

const express = require('express');
const router = express.Router();

router.get('/admin/add-product', adminController.getAddProductPage);
router.get('/admin/products', adminController.getProducts);

router.post('/admin/add-product', adminController.postAddProduct);
  
module.exports = router;