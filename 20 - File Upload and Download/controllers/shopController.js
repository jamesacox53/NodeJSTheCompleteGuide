const path = require('path');
const fs = require('fs');

const pdfGenerator = require(path.join('..', 'utils', 'pdfGenerator', 'pdfGenerator.js'));
const Product = require(path.join('..', 'models', 'product.js'));
const Order = require(path.join('..', 'models', 'order.js'));

const ITEMS_PER_PAGE = 2;

exports.getProducts = (request, response, next) => {
  Product.find()
  .then(arr => _getProducts(arr))
  .catch(err => _handleError(err));
  
  function _getProducts(arr) {
    const optionsObj = {
      path: path,
      pageTitle: 'All Products',
      pathStr: '/products',
      prods: arr
    };
  
    response.render(path.join('shop', 'product-list.ejs'), optionsObj);
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.getProduct = (request, response, next) => {
  const productID = request.params.productID;
  
  Product.findById(productID)
  .then(product => _renderProductDetailsPage(product, response))
  .catch(err => _handleError(err));
  
  function _renderProductDetailsPage (product, response) {
    const optionsObj = {
      path: path,
      pageTitle: product.title,
      pathStr: '/products',
      product: product
    };

    response.render(path.join('shop', 'product-detail.ejs'), optionsObj);
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.getIndex = (request, response, next) => {
  const page = request.query.page;
  
  Product.find()
  .skip((page - 1) * ITEMS_PER_PAGE)
  .limit(ITEMS_PER_PAGE)
  .then(arr => _getProducts(arr, response))
  .catch(err => _handleError(err));
  
  function _getProducts(arr, response) {
    const optionsObj = {
      path: path,
      pageTitle: 'Shop',
      pathStr: '/',
      prods: arr
    };
  
    response.render(path.join('shop', 'index.ejs'), optionsObj);
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.getCart = (request, response, next) => {
  request.user.getCart()
  .then(cart => _renderCartPage(cart))
  .catch(err => _handleError(err));
  
  function _renderCartPage(cart) {
    const optionsObj = {
      path: path,
      pageTitle: 'Your Cart',
      pathStr: '/cart',
      cart: cart
    };
    
    response.render(path.join('shop', 'cart.ejs'), optionsObj);
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.postCart = (request, response, next) => {
  const productID = request.body.productID;
  
  Product.findById(productID)
  .then(product => request.user.addToCart(product))
  .then(err => _redirectToCartPage(response))
  .catch(err => _handleError(err));

  function _redirectToCartPage(response) {
    response.redirect('/cart');
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.postCartDeleteItem = (request, response, next) => {
  const productID = request.body.productID;

  request.user.deleteCartItem(productID)
  .then(err => _redirectToCart(response))
  .catch(err => _handleError(err));

  function _redirectToCart(response) {
    response.redirect('/cart');
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.getOrders = (request, response, next) => {
  Order.find({ 'user.userID': request.user._id })
  .then(ordersArr => _renderOrdersPage(ordersArr))
  .catch(err => _handleError(err))
  
  function _renderOrdersPage(ordersArr) {
    const optionsObj = {
      path: path,
      pageTitle: 'Your Orders',
      pathStr: '/orders',
      ordersArr: ordersArr
    };
  
    response.render(path.join('shop', 'orders.ejs'), optionsObj);
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.postOrder = (request, response, next) => {
  request.user.populate('cart.items.productID')
  .then(user => _createOrder(user))
  .then(order => request.user.clearCart())
  .then(err => _redirectToOrdersPage(response))
  .catch(err => _handleError(err));

  function _createOrder(user) {
    const orderObj = Order.getOrderConstructorObj(user);
    
    const order = new Order(orderObj);
    return order.save();
  }

  function _redirectToOrdersPage(response) {
    response.redirect('/orders');
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};

exports.getInvoice = (request, response, next) => {
  const orderID = request.params.orderID;

  Order.findById(orderID)
  .then(order => _getInvoice(order))
  .catch(err => next(err));
  
  function _getInvoice(order) {
    if (!order)
      return next(new Error('No order found.'));

    if (order.user.userID.toString() !== request.user._id.toString())
      return next(new Error('Unauthorized.'));

    const inputObj = {
      request: request,
      response: response,
      next: next,
      order: order
    };

    return pdfGenerator.generateInvoicePDF(inputObj);
  }
};

/*
exports.getCheckout = (request, response, next) => {
  Product.findAll()
  .then(arr => _getProducts(arr, response))
  .catch(err => console.log(err));
  
  function _getProducts(arr, response) {
    const optionsObj = {
      path: path,
      pageTitle: 'Checkout',
      pathStr: '/checkout',
      prods: arr
    };
  
    response.render(path.join('shop', 'checkout.ejs'), optionsObj);
  }
};
*/