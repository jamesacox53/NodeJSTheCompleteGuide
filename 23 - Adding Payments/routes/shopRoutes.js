const path = require('path');
const isAuth = require(path.join('..', 'middleware', 'isAuth.js'));
const shopController = require(path.join('..', 'controllers', 'shopController.js'));

const express = require('express');
const router = express.Router();

router.get('/products/:productID', shopController.getProduct);
router.get('/products', shopController.getProducts);
router.get('/cart', isAuth, shopController.getCart);
router.get('/orders', isAuth, shopController.getOrders);
router.get('/orders/invoices/:orderID', isAuth, shopController.getInvoice);
router.get('/checkout/success', isAuth, shopController.getCheckoutSuccess);
router.get('/checkout/cancel', isAuth, shopController.getCheckout);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/', shopController.getIndex);

router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteItem);
// router.post('/create-order', isAuth, shopController.postOrder);

module.exports = router;