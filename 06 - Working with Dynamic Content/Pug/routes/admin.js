const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory.js');

router.get('/admin/add-product', (request, response, next) => {
  response.sendFile(path.join(rootDirectoryStr, 'views', 'add-product.html'));
});

router.post('/admin/add-product', (request, response, next) => {
  console.log(request.body);
  response.redirect('/');
});

module.exports = router;