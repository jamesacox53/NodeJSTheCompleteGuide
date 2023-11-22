const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');
const productsArr = require('../database/productsArr.js');

router.get('/', (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Shop',
    path: '/',
    hasProds: (productsArr.length > 0),
    prods: productsArr,
    activeShop: true,
    productCSS: true
  };

  response.render('shop.hbs', optionsObj);
});

module.exports = router;