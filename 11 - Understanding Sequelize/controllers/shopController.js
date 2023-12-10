const path = require('path');
const Product = require(path.join('..', 'models', 'product.js'));
const Cart = require(path.join('..', 'models', 'cart.js'));

exports.getProducts = (request, response, next) => {
  Product.fetchAll()
  .then(arr => _getProducts(arr))
  .catch(err => console.log(err));
  
  function _getProducts(arr) {
    const productsArr = arr[0];
    if (!productsArr) return;

    const optionsObj = {
      path: path,
      pageTitle: 'All Products',
      pathStr: '/products',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'product-list.ejs'), optionsObj);
  }
};

exports.getProduct = (request, response, next) => {
  const productID = request.params.productID;
  
  Product.getProductByID(productID)
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
  Product.fetchAll()
  .then(arr => _getProducts(arr, response))
  .catch(err => console.log(err));
  
  function _getProducts(arr, response) {
    const productsArr = arr[0];
    if (!productsArr) return;

    const optionsObj = {
      path: path,
      pageTitle: 'Shop',
      pathStr: '/',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'index.ejs'), optionsObj);
  }
};

exports.postCart = (request, response, next) => {
  const productID = request.body.productID;

  Product.getProductByID(productID)
  .then(product => _postCart(product))
  .catch(err => console.log(err));

  function _postCart(product) {
    Cart.addProduct(product, (err) => {
      response.redirect('/cart');
    });
  }
};

exports.postCartDeleteItem = (request, response, next) => {
  const productID = request.body.productID;

  Cart.deleteProductByID(productID, (error) => {
    response.redirect('/cart');
  });
};

exports.getCart = (request, response, next) => {
  getCartView(response);

  function getCartView(response) {
    Cart.fetchCart((cartObj) => {
      Product.fetchAll()
      .then(arr => _getProducts(arr, response))
      .catch(err => console.log(err));
  
      function _getProducts(arr, response) {
        const productsArr = arr[0];
        if (!productsArr) return;
        
        const cartViewProdsObjArr = _getCartViewProdObjArr(cartObj, productsArr);

        const optionsObj = {
        path: path,
        pageTitle: 'Your Cart',
        pathStr: '/cart',
        cartViewProdsObjArr: cartViewProdsObjArr
        };
      
        response.render(path.join('shop', 'cart.ejs'), optionsObj);
      }
    });
  }

  function _getCartViewProdObjArr(cartObj, productsArr) {
    const cartViewProdsObjArr = [];
    const cartProdsArr = cartObj.productsArr;

    for (let i = 0; i < cartProdsArr.length; i++) {
      const cartProduct = cartProdsArr[i];
      const product = _getProductForCartProduct(cartProduct, productsArr);
      if (!product) continue;

      const cartViewProdObj = {
        product: product,
        cartProduct: cartProduct
      };

      cartViewProdsObjArr.push(cartViewProdObj);
    }

    return cartViewProdsObjArr;
  }
  
  function _getProductForCartProduct(cartProduct, productsArr) {
    for (let i = 0; i < productsArr.length; i++) {
      const product = productsArr[i];
      if (cartProduct.id == product.id)
        return product;
    }
  }
};

exports.getOrders = (request, response, next) => {
  Product.fetchAll()
  .then(arr => _getProducts(arr, response))
  .catch(err => console.log(err));
  
  function _getProducts(arr, response) {
    const productsArr = arr[0];
    if (!productsArr) return;

    const optionsObj = {
      path: path,
      pageTitle: 'Orders',
      pathStr: '/orders',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'orders.ejs'), optionsObj);
  }
};

exports.getCheckout = (request, response, next) => {
  Product.fetchAll()
  .then(arr => _getProducts(arr, response))
  .catch(err => console.log(err));
  
  function _getProducts(arr, response) {
    const productsArr = arr[0];
    if (!productsArr) return;

    const optionsObj = {
      path: path,
      pageTitle: 'Checkout',
      pathStr: '/checkout',
      prods: productsArr
    };
  
    response.render(path.join('shop', 'checkout.ejs'), optionsObj);
  }
};