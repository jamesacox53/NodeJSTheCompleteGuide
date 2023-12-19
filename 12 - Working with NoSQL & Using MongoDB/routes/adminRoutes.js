const path = require('path');
const adminController = require(path.join('..', 'controllers', 'adminController.js'));

const express = require('express');
const router = express.Router();

router.get('/admin/add-product', adminController.getAddProductPage);
// router.get('/admin/edit-product/:productID', adminController.getEditProductPage);
// router.get('/admin/products', adminController.getProducts);

router.post('/admin/add-product', adminController.postAddProduct);
// router.post('/admin/edit-product', adminController.postEditProduct);
// router.post('/admin/delete-product', adminController.postDeleteProduct);

module.exports = router;