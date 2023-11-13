const path = require('path');
const express = require('express');

const rootDirectoryStr = require('../util/rootDirectory');

const router = express.Router();

router.get('/add-product', (request, response, next) => {
    const addProductHTMLFilePath = path.join(rootDirectoryStr, 'views', 'add-product.html');
    response.sendFile(addProductHTMLFilePath);
});

router.post('/product', (request, response, next) => {
    console.log(request.body);
    response.redirect('/');
});

module.exports = router;