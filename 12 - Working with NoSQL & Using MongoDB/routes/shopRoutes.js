const path = require('path');
const shopController = require(path.join('..', 'controllers', 'shopController.js'));

const express = require('express');
const router = express.Router();

// router.get('/products/:productID', shopController.getProduct);
router.get('/products', shopController.getProducts);
// router.get('/cart', shopController.getCart);
// router.get('/orders', shopController.getOrders);
// router.get('/checkout', shopController.getCheckout);
router.get('/', shopController.getIndex);

// router.post('/cart', shopController.postCart);
// router.post('/cart-delete-item', shopController.postCartDeleteItem);
// router.post('/create-order', shopController.postOrder);

module.exports = router;