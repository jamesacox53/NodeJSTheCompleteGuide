const path = require('path');
const shopController = require(path.join('..', 'controllers', 'shop.js'));

const express = require('express');
const router = express.Router();

router.get('/products', shopController.getProducts);
router.get('/cart', shopController.getCart);
router.get('/checkout', shopController.getCheckout);
router.get('/', shopController.getIndex);

module.exports = router;