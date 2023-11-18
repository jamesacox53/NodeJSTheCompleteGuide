const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');
const productsArr = require('../database/productsArr.js');

router.get('/', (request, response, next) => {
  response.render('shop.pug', { prods: productsArr });
});

module.exports = router;
