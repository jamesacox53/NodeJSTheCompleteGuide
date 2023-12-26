const path = require('path');
const Product = require(path.join('..', 'models', 'product.js'));

exports.getProducts = (request, response, next) => {
  Product.find()
  .then(arr => _getProducts(arr))
  .catch(err => console.log(err));
  
  function _getProducts(arr) {
    const optionsObj = {
      path: path,
      pageTitle: 'All Products',
      pathStr: '/products',
      prods: arr
    };
  
    response.render(path.join('shop', 'product-list.ejs'), optionsObj);
  }
};

exports.getProduct = (request, response, next) => {
  const productID = request.params.productID;
  
  Product.findById(productID)
  .then(product => _renderProductDetailsPage(product, response))
  .catch(err => console.log(err));
  
  function _renderProductDetailsPage (product, response) {
    const optionsObj = {
      path: path,
      pageTitle: product.title,
      pathStr: '/products',
      product: product
    };

    response.render(path.join('shop', 'product-detail.ejs'), optionsObj);
  }
};

exports.getIndex = (request, response, next) => {
  Product.find()
  .then(arr => _getProducts(arr, response))
  .catch(err => console.log(err));
  
  function _getProducts(arr, response) {
    const optionsObj = {
      path: path,
      pageTitle: 'Shop',
      pathStr: '/',
      prods: arr
    };
  
    response.render(path.join('shop', 'index.ejs'), optionsObj);
  }
};

/*
exports.getCart = (request, response, next) => {
  request.user.getCart()
  .then(cartProducts => _renderCartPage(cartProducts))
  .catch(err => console.log(err));
  
  function _renderCartPage(cartProducts) {
    const optionsObj = {
      path: path,
      pageTitle: 'Your Cart',
      pathStr: '/cart',
      productsArr: cartProducts
    };
    
    response.render(path.join('shop', 'cart.ejs'), optionsObj);
  }
};

exports.postCart = (request, response, next) => {
  const productID = request.body.productID;
  
  Product.findById(productID)
  .then(product => request.user.addToCart(product))
  .then(err => _redirectToCartPage(response))
  .catch(err => console.log(err));

  function _redirectToCartPage(response) {
    response.redirect('/cart');
  }
};

exports.postCartDeleteItem = (request, response, next) => {
  const productID = request.body.productID;

  request.user.deleteCartItem(productID)
  .then(err => _redirectToCart(response))
  .catch(err => console.log(err));

  function _redirectToCart(response) {
    response.redirect('/cart');
  }
};

exports.getOrders = (request, response, next) => {
  request.user.getOrders()
  .then(ordersArr => _renderOrdersPage(ordersArr))
  .catch(err => console.log(err))
  
  function _renderOrdersPage(ordersArr) {
    const optionsObj = {
      path: path,
      pageTitle: 'Your Orders',
      pathStr: '/orders',
      ordersArr: ordersArr
    };
  
    response.render(path.join('shop', 'orders.ejs'), optionsObj);
  }
};

exports.postOrder = (request, response, next) => {
  request.user.addOrder()
  .then(err => _redirectToOrdersPage(response))
  .catch(err => console.log(err));

  function _redirectToOrdersPage(response) {
    response.redirect('/orders');
  }
};

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