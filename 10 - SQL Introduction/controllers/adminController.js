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

  const product = new Product(productArgsObj);

  product.save((error) => {
    response.redirect('/');
  });
};

exports.getEditProductPage = (request, response, next) => {
  const callbackFunc = (product) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Edit Product',
      pathStr: '/admin/edit-product',
      product: product
    };

    response.render(path.join('admin', 'edit-product.ejs'), optionsObj);
  };

  const productID = request.params.productID;
  Product.getProductByID(productID, callbackFunc);
};

exports.postEditProduct = (request, response, next) => {
  const productID = request.body.productID;
  
  Product.getProductByID(productID, (product) => {
    product.title = request.body.title;
    product.imageURL = request.body.imageURL;
    product.description = request.body.description;
    product.price = request.body.price;
  
    product.save((error) => {
      response.redirect('/admin/products');
    });
  });
};

exports.getProducts = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      path: path,
      pageTitle: 'Admin Products',
      pathStr: '/admin/products',
      prods: productsArr
    };
  
    response.render(path.join('admin', 'products.ejs'), optionsObj);
  }

  Product.fetchAll(callbackFunc);
};

exports.postDeleteProduct = (request, response, next) => {
  const productID = request.body.productID;

  Product.deleteByID(productID, (error) => {
    response.redirect('/admin/products');
  });
};