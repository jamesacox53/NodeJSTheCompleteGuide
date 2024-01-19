const path = require('path');

const isAuth = require(path.join('..', 'middleware', 'isAuth.js'));
const adminController = require(path.join('..', 'controllers', 'adminController.js'));
const productValidators = require(path.join('..', 'validators', 'productValidators.js'));

const express = require('express');
const router = express.Router();

router.get('/admin/add-product', isAuth, adminController.getAddProductPage);
router.get('/admin/edit-product/:productID', isAuth, adminController.getEditProductPage);
router.get('/admin/products', isAuth, adminController.getProducts);

router.post('/admin/add-product', isAuth, productValidators.productValidatorsArr, adminController.postAddProduct);
router.post('/admin/edit-product', isAuth, productValidators.productValidatorsArr, adminController.postEditProduct);
router.post('/admin/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;