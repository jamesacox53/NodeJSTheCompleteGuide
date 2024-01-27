const path = require('path');
const fs = require('fs');

const pdfGenerator = require(path.join('..', 'utils', 'pdfGenerator', 'pdfGenerator.js'));
const Product = require(path.join('..', 'models', 'product.js'));
const Order = require(path.join('..', 'models', 'order.js'));
const controllerUtils = require(path.join('..', 'utils', 'controllerUtils', 'controllerUtils.js'));

const stripeObj = require(path.join('..', 'sensitive', 'stripeObj.js'));
const stripe = require('stripe')(stripeObj.secretKey);

const ITEMS_PER_PAGE = 2;

exports.getProducts = (request, response, next) => {
  return Product.find()
  .countDocuments()
  .then(totalNumProds => _getProducts(totalNumProds))
  .catch(err => _handleError(err));
  
  function _getProducts(totalNumProds) {
    const page = controllerUtils.getPageNum(request, ITEMS_PER_PAGE, totalNumProds);

    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(arr => _getProds(arr, page, totalNumProds))
    .catch(err => _handleError(err));
  }

  function _getProds(arr, page, totalNumProds) {
    const paginationPagesArr = controllerUtils.getPaginationPagesArr(page, ITEMS_PER_PAGE, totalNumProds);

    const optionsObj = {
      path: path,
      pageTitle: 'All Products',
      pathStr: '/products',
      prods: arr,
      currPage: page,
      paginationPagesArr: paginationPagesArr
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
    const page = controllerUtils.getPageNum(request, ITEMS_PER_PAGE, totalNumProds);

    return Product.find()
    .skip((page - 1) * ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
    .then(arr => _getProducts(arr, page, totalNumProds))
    .catch(err => _handleError(err));
  }

  function _getProducts(arr, page, totalNumProds) {
    const paginationPagesArr = controllerUtils.getPaginationPagesArr(page, ITEMS_PER_PAGE, totalNumProds);

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

exports.getCheckoutSuccess = (request, response, next) => {
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

exports.getCheckout = (request, response, next) => {
  let userCart;

  request.user.getCart()
  .then(cart => { userCart = cart })
  .then(err => _getStripeSession(userCart))
  .then(session => _renderCheckoutPage(session))
  .catch(err => _handleError(err));
  
  function _getStripeSession(userCart) {
    const successURL = request.protocol + '://' + request.get('host') + '/checkout/success';
    const cancelURL = request.protocol + '://' + request.get('host') + '/checkout/cancel';

    const stripeSessionObj = {
      payment_method_types: ['card'],
      line_items: _getStripeLineItemsArr(userCart),
      mode: 'payment',
      success_url: successURL,
      cancel_url: cancelURL
    };

    return stripe.checkout.sessions.create(stripeSessionObj);
  }

  function _getStripeLineItemsArr(userCart) {
    const items = userCart.items;

    return items.map(item => {
      return {
        price_data: {
          currency: 'usd',
          unit_amount: item.productID.price * 100,
          product_data: {
            name: item.productID.title,
            description: item.productID.description
          }  
        },
        quantity: item.quantity
      };
    });
  }

  function _renderCheckoutPage(session) {
    const totalPrice = _calculateTotalPrice(userCart);

    const optionsObj = {
      path: path,
      pageTitle: 'Checkout',
      pathStr: '/checkout',
      cart: userCart,
      totalPrice: totalPrice,
      sessionID: session.id
    };
    
    response.render(path.join('shop', 'checkout.ejs'), optionsObj);
  }

  function _calculateTotalPrice(userCart) {
    const items = userCart.items;
    let totalPrice = 0;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      const cost = item.quantity * item.productID.price;
      totalPrice += cost;
    }

    return totalPrice;
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};