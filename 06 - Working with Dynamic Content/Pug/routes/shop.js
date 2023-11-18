const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');

router.get('/', (request, response, next) => {
  response.render('shop.pug');
});

module.exports = router;
