const path = require('path');
const { validationResult } = require('express-validator');
const Product = require(path.join('..', 'models', 'product.js'));

exports.getAddProductPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Add Product',
    pathStr: '/admin/add-product',
    errorMessage: '',
    oldInput: {
      title: '',
      imageURL: '',
      price: 0,
      description: ''
    },
    fieldErrorsObj: {
      title: false,
      imageURL: false,
      price: false,
      description: false
    }
  };
   
  response.render(path.join('admin', 'add-product.ejs'), optionsObj);
};

exports.postAddProduct = (request, response, next) => {
  return _postAddProuct();
  
  function _postAddProuct() {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return _renderAddProductPage(errors.array());
  
    } else {
      return _addProduct();
    }
  }

  function _renderAddProductPage(errorsArr) {
    const optionsObj = {
      path: path,
      pageTitle: 'Add Product',
      pathStr: '/admin/add-product',
      errorMessage: _getErrorMsg(errorsArr),
      oldInput: {
        title: request.body.title,
        imageURL: request.body.imageURL,
        price: request.body.price,
        description: request.body.description
      },
      fieldErrorsObj: _getFieldErrorsObj(errorsArr)
    };
     
    response.render(path.join('admin', 'add-product.ejs'), optionsObj);
  }

  function _getErrorMsg(errorsArr) {
    const messagesArr = [];
    
    for(let i = 0; i < errorsArr.length; i++) {
      const messageStr = errorsArr[i].msg;
    
      messagesArr.push(messageStr);
    }
    
    return messagesArr.join('. ');
  }

  function _getFieldErrorsObj(errorsArr) {
    const fieldErrorsObj = {
      title: false,
      imageURL: false,
      price: false,
      description: false
    };
  
    for (let i = 0; i < errorsArr.length; i++) {
      const errorObj = errorsArr[i];
      const path = errorObj['path'];
  
      fieldErrorsObj[path] = true;
    }
  
    return fieldErrorsObj;
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
    .catch(err => console.log(err));
  }
    
  function _gotoIndexPage(err) {
    response.redirect('/');
  }
};

exports.getEditProductPage = (request, response, next) => {
  const productID = request.params.productID;

  Product.findById(productID)
  .then(product => _renderEditProductPage(product, response))
  .catch(err => console.log(err));
  
  function _renderEditProductPage(product, response) {
    const optionsObj = {
      path: path,
      pageTitle: 'Edit Product',
      pathStr: '/admin/edit-product',
      product: product
    };

    response.render(path.join('admin', 'edit-product.ejs'), optionsObj);
  }
};

exports.postEditProduct = (request, response, next) => {
  const productID = request.body.productID;
  
  Product.findById(productID)
  .then(product => _ifProductIsCreatedByUserThenEdit(product, request, response))
  
  function _ifProductIsCreatedByUserThenEdit(product, request, response) {
    if (product.userID.toString() !== request.user._id.toString()) {
      return response.redirect('/');
    }

    return _editProductAndSave(product, request)
    .then(err => _gotoAdminProductPage(err, response))
    .catch(err => console.log(err));
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
    response.redirect('/admin/products');
  }
};

exports.getProducts = (request, response, next) => {
  Product.find({ userID: request.user._id })
  .then(arr => _renderAdminProductsPage(arr))
  .catch(err => console.log(err));
  
  function _renderAdminProductsPage(arr) {
    const optionsObj = {
      path: path,
      pageTitle: 'Admin Products',
      pathStr: '/admin/products',
      prods: arr
    };
  
    response.render(path.join('admin', 'products.ejs'), optionsObj);
  }
};

exports.postDeleteProduct = (request, response, next) => {
  const whereObj = {
    _id: request.body.productID,
    userID: request.user._id
  };
  
  Product.deleteOne(whereObj)
  .then(res => _redirectToAdminProducts(response))
  .catch(err => console.log(err));

  function _redirectToAdminProducts(response) {
    response.redirect('/admin/products');
  }
};