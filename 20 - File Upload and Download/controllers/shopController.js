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
  return Product.find()
  .countDocuments()
  .then(totalNumProds => _getIndex(totalNumProds));
  
  function _getIndex(totalNumProds) {
    const page = _getPageNum(totalNumProds);

    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(arr => _getProducts(arr, page, totalNumProds))
    .catch(err => _handleError(err));
  }

  function _getPageNum(totalNumProds) {
    const page = request.query.page;
    if (!page) return 1;

    const pageNum = parseInt(page, 10);
    if (pageNum < 1) return 1;

    const numPages = Math.ceil(totalNumProds / ITEMS_PER_PAGE);
    if (pageNum > numPages) return numPages;
    
    return pageNum;
  }

  function _getProducts(arr, page, totalNumProds) {
    const paginationPagesArr = _getPaginationPagesArr(page, totalNumProds);

    const optionsObj = {
      path: path,
      pageTitle: 'Shop',
      pathStr: '/',
      prods: arr,
      currPage: page,
      paginationPagesArr: paginationPagesArr
    };
  
    response.render(path.join('shop', 'index.ejs'), optionsObj);
  }

  function _getPaginationPagesArr(page, totalNumProds) {
    const prevPage = page - 1;
    const nextPage = page + 1;
    const numPages = Math.ceil(totalNumProds / ITEMS_PER_PAGE);
    
    const pagesArr = [1]; 
    
    if (prevPage > 1 && prevPage < numPages)
      pagesArr.push(prevPage);

    if (page > 1 && page < numPages)
      pagesArr.push(page);

    if (nextPage > 1 && nextPage < numPages)
      pagesArr.push(nextPage);
    
    if (numPages > 1)
      pagesArr.push(numPages);
    
    return pagesArr;
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