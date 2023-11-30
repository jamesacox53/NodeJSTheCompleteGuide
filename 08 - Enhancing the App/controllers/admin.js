const Product = require('../models/product.js');

exports.getAddProductPage = (request, response, next) => {
  const optionsObj = {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  };
   
  response.render('admin/add-product.ejs', optionsObj);
};
  
exports.postAddProduct = (request, response, next) => {
  const productTitleStr = request.body.title;
  const product = new Product(productTitleStr);
    
  console.log(productTitleStr);
  product.save();
  
  response.redirect('/');
};

exports.getProducts = (request, response, next) => {
  const callbackFunc = (productsArr) => {
    const optionsObj = {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      prods: productsArr
    };
  
    response.render('admin/products.ejs', optionsObj);
  }

  Product.fetchAll(callbackFunc);
};