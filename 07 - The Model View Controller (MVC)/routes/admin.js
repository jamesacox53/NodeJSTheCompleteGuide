const productsController = require('../controllers/products.js');

const express = require('express');
const router = express.Router();

router.get('/admin/add-product', productsController.getAddProductPage);

router.post('/admin/add-product', productsController.postAddProduct);
  
module.exports = router;