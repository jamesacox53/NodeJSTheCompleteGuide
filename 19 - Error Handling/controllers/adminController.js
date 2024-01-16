const path = require('path');
const { validationResult } = require('express-validator');

const adminRenderer = require(path.join('..', 'viewRenderers', 'adminRenderer.js'));
const Product = require(path.join('..', 'models', 'product.js'));

exports.getAddProductPage = (request, response, next) => {
  const inputObj = {
    response: response
  };

  adminRenderer.renderAddProductPage(inputObj);
};

exports.postAddProduct = (request, response, next) => {
  return _postAddProduct();
  
  function _postAddProduct() {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return _renderAddProductPage(errors.array());
  
    } else {
      return _addProduct();
    }
  }

  function _renderAddProductPage(errorsArr) {
    const inputObj = {
      request: request,
      response: response,
      status: 442,
      errorsArr: errorsArr
    };
  
    adminRenderer.renderAddProductPage(inputObj);
  }

  function _addProduct() {
    const productArgsObj = {
      title: request.body.title,
      imageURL: request.body.imageURL,
      price: request.body.price,
      description: request.body.description,
      userID: request.user._id
    };
  
    const product = new Product(productArgsObj);
    
    return product.save()
    .then(err => _gotoIndexPage(err))
    .catch(err => _handleError(err));
  }
    
  function _gotoIndexPage(err) {
    response.redirect('/');
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getEditProductPage = (request, response, next) => {
  const productID = request.params.productID;

  Product.findById(productID)
  .then(product => _renderEditProductPage(product, response))
  .catch(err => _handleError(err));
  
  function _renderEditProductPage(product, response) {
    const inputObj = {
      response: response,
      product: product
    };
  
    adminRenderer.renderEditProductPage(inputObj); 
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postEditProduct = (request, response, next) => {
  _postEditProduct();

  function _postEditProduct() {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return _renderEditProductPage(errors.array());
  
    } else {
      return _editProduct();
    }
  }
  
  function _renderEditProductPage(errorsArr) {
    const inputObj = {
      request: request,
      response: response,
      status: 442,
      errorsArr: errorsArr
    };
  
    adminRenderer.renderEditProductPage(inputObj);
  }

  function _editProduct() {
    const productID = request.body.productID;
  
    return Product.findById(productID)
    .then(product => _ifProductIsCreatedByUserThenEdit(product, request, response));
  }

  function _ifProductIsCreatedByUserThenEdit(product, request, response) {
    if (product.userID.toString() !== request.user._id.toString()) {
      return response.redirect('/');
    }

    return _editProductAndSave(product, request)
    .then(err => _gotoAdminProductPage(err, response))
    .catch(err => _handleError(err));
  }

  function _editProductAndSave(product, request) {
    product.title = request.body.title;
    product.imageURL = request.body.imageURL;
    product.description = request.body.description;
    product.price = request.body.price;
    product.userID = request.user._id;
  
    return product.save();
  }

  function _gotoAdminProductPage(err, response) {
    return response.redirect('/admin/products');
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProducts = (request, response, next) => {
  Product.find({ userID: request.user._id })
  .then(arr => _renderAdminProductsPage(arr))
  .catch(err => _handleError(err));
  
  function _renderAdminProductsPage(arr) {
    const inputObj = {
      response: response,
      arr: arr
    };
  
    adminRenderer.renderAdminProductsPage(inputObj);
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postDeleteProduct = (request, response, next) => {
  const whereObj = {
    _id: request.body.productID,
    userID: request.user._id
  };
  
  Product.deleteOne(whereObj)
  .then(res => _redirectToAdminProducts(response))
  .catch(err => _handleError(err));

  function _redirectToAdminProducts(response) {
    response.redirect('/admin/products');
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};