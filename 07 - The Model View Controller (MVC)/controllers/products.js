const productsArr = require('../database/productsArr.js');

exports.getAddProductPage = (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Add Product',
    path: '/admin/add-product'
  };
  
  response.render('add-product.ejs', optionsObj);
};

exports.postAddProduct = (request, response, next) => {
  var productDetailsObj = {
    title: request.body.title
  };
  
  console.log(productDetailsObj.title);
  
  productsArr.push(productDetailsObj);
  response.redirect('/');
};

exports.getProducts = (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Shop',
    path: '/',
    prods: productsArr
  };

  response.render('shop.ejs', optionsObj);
};