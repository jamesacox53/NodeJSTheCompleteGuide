const path = require('path');
const Product = require(path.join('..', 'models', 'product.js'));

exports.getProducts = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'All Products',
      pathStr: '/products',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'product-list.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getIndex = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Shop',
      pathStr: '/',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'index.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getCart = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Your Cart',
      pathStr: '/cart',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'cart.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getOrders = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Orders',
      pathStr: '/orders',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'orders.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.getCheckout = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Checkout',
      pathStr: '/checkout',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'checkout.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};