const path = require('path');
const Product = require(path.join('..', 'models', 'product.js'));
const CartItem = require(path.join('..', 'models', 'cart-item.js'));
const OrderItem = require(path.join('..', 'models', 'order-item.js'));

exports.getProducts = (request, response, next) => {
  Product.findAll()
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
  
  Product.findByPk(productID)
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
  Product.findAll()
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

exports.postCart = (request, response, next) => {
  const productID = request.body.productID;
  let userCart;
  
  request.user.getCart()
  .then(cart => { userCart = cart })
  .then(err => _getExistingProductCartItem(userCart, productID))
  .then(productCartItem => _addProductToCart(userCart, productID, productCartItem))
  .then(err => _redirectToCartPage(response))
  .catch(err => console.log(err));

  function _getExistingProductCartItem(userCart, productID) {
    const optionsObj = {
      where: {
        cartId: userCart.id,
        productId: productID
      }
    };

    return CartItem.findOne(optionsObj);
  }

  function _addProductToCart(userCart, productID, productCartItem) {
    if (productCartItem) {
      const oldQuantityInt = parseInt(productCartItem.quantity, 10);
      productCartItem.quantity = (oldQuantityInt + 1);

      return productCartItem.save();
    
    } else {
      const cartItemObj = {
        quantity: 1,
        cartId: userCart.id,
        productId: productID
      };
      
      return CartItem.create(cartItemObj);
    }
  }

  function _redirectToCartPage(response) {
    response.redirect('/cart');
  }
};

exports.postCartDeleteItem = (request, response, next) => {
  const productID = request.body.productID;

  request.user.getCart()
  .then(cart => _deleteCartItem(cart, productID))
  .then(err => _redirectToCart(response))
  .catch(err => console.log(err));

  function _deleteCartItem(cart, productID) {
    const optionsObj = {
      where: {
        cartId: cart.id,
        productId: productID
      }
    };

    return CartItem.destroy(optionsObj);
  }

  function _redirectToCart(response) {
    response.redirect('/cart');
  }
};

exports.getCart = (request, response, next) => {
  request.user.getCart()
  .then(cart => cart.getProducts())
  .then(products => _renderCartPage(products))
  .catch(err => console.log(err));
  
  function _renderCartPage(products) {
    const optionsObj = {
      path: path,
      pageTitle: 'Your Cart',
      pathStr: '/cart',
      productsArr: products
    };
    
    response.render(path.join('shop', 'cart.ejs'), optionsObj);
  }
};

exports.getOrders = (request, response, next) => {
  Product.findAll()
  .then(arr => _getProducts(arr, response))
  .catch(err => console.log(err));
  
  function _getProducts(arr, response) {
    const optionsObj = {
      path: path,
      pageTitle: 'Orders',
      pathStr: '/orders',
      prods: arr
    };
  
    response.render(path.join('shop', 'orders.ejs'), optionsObj);
  }
};

exports.postOrder = (request, response, next) => {
  let userCartItemsArr;
  
  request.user.getCart()
  .then(cart => _getCartItemsArr(cart))
  .then(cartItemsArr => { userCartItemsArr = cartItemsArr })
  .then(err => request.user.createOrder())
  .then(order => _createOrderItems(order, userCartItemsArr))
  .then(err => _redirectToOrdersPage(response))
  .catch(err => console.log(err));

  function _getCartItemsArr(cart) {
    const optionsObj = {
      where: {
        cartId: cart.id
      }
    };
    
    return CartItem.findAll(optionsObj);
  }

  function _createOrderItems(order, userCartItemsArr) {
    const orderItemArr = [];

    for(let i = 0; i < userCartItemsArr.length; i++) {
      const userCartItemObj = userCartItemsArr[i];
      
      const orderItemObj = {
        orderId: order.id,
        productId: userCartItemObj.productId,
        quantity: userCartItemObj.quantity,
      };

      orderItemArr.push(orderItemObj);
    }
    
    return OrderItem.bulkCreate(orderItemArr);
  }

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