const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');
const productsArr = require('../database/productsArr.js');

router.get('/', (request, response, next) => {
  var optionsObj = {
    pageTitle: 'Shop',
    path: '/',
    prods: productsArr
  };

  response.render('shop.ejs', optionsObj);
});

module.exports = router;