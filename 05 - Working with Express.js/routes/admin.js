const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/add-product', (request, response, next) => {
    const addProductHTMLFilePath = path.join(__dirname, '../', 'views', 'add-product.html');

    response.sendFile(addProductHTMLFilePath);
});

router.post('/product', (request, response, next) => {
    console.log(request.body);
    response.redirect('/');
});

module.exports = router;