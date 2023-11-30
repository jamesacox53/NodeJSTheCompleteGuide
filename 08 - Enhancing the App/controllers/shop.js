const Product = require('../models/product.js');

exports.getProducts = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      pageTitle: 'All Products',
      path: '/products',
      prods: productsArr
    };
  
    response.render('shop/product-list.ejs', optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getIndex = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      pageTitle: 'Shop',
      path: '/',
      prods: productsArr
    };
  
    response.render('shop/index.ejs', optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getCart = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      pageTitle: 'Your Cart',
      path: '/cart',
      prods: productsArr
    };
  
    response.render('shop/cart.ejs', optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getCheckout = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      pageTitle: 'Checkout',
      path: '/checkout',
      prods: productsArr
    };
  
    response.render('shop/checkout.ejs', optionsObj);
  }

  Product.fetchAll(callbackFunc);
};