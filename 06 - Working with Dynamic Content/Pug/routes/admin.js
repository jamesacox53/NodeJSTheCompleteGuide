const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory.js');
const productsArr = require('../database/productsArr.js');

router.get('/admin/add-product', (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Add Product'
  };

  response.render('add-product.pug', optionsObj);
});

router.post('/admin/add-product', (request, response, next) => {
  var productDetailsObj = {
    title: request.body.title
  };

  console.log(productDetailsObj.title);

  productsArr.push(productDetailsObj);
  response.redirect('/');
});

module.exports = router;