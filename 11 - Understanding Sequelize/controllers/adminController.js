const path = require('path');
const Product = require(path.join('..', 'models', 'product.js'));

exports.getAddProductPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Add Product',
    pathStr: '/admin/add-product'
  };
   
  response.render(path.join('admin', 'add-product.ejs'), optionsObj);
};

exports.postAddProduct = (request, response, next) => {
  const productArgsObj = {
    title: request.body.title,
    imageURL: request.body.imageURL,
    price: request.body.price,
    description: request.body.description
  };
  
  Product.create(productArgsObj)
  .then(err => _gotoIndexPage(err, response))
  .catch(err => console.log(err));
  
  function _gotoIndexPage(err, response) {
    response.redirect('/');
  }
};

exports.getEditProductPage = (request, response, next) => {
  const productID = request.params.productID;

  Product.findByPk(productID)
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
  
  Product.findByPk(productID)
  .then(product => _editProductAndSave(product, request))
  .then(err => _gotoAdminProductPage(err, response))
  .catch(err => console.log(err));
  
  function _editProductAndSave(product, request) {
    product.title = request.body.title;
    product.imageURL = request.body.imageURL;
    product.description = request.body.description;
    product.price = request.body.price;
  
    return product.save();
  }

  function _gotoAdminProductPage(err, response) {
    response.redirect('/admin/products');
  }
};

exports.getProducts = (request, response, next) => {
  Product.findAll()
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
  const productID = request.body.productID;

  Product.deleteByID(productID, (error) => {
    response.redirect('/admin/products');
  });
};