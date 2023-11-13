const path = require('path');
const express = require('express');

const rootDirectoryStr = require('../util/rootDirectory');

const router = express.Router();

router.get('/', (request, response, next) => {
    const shopHTMLFilePath = path.join(rootDirectoryStr, 'views', 'shop.html');
    response.sendFile(shopHTMLFilePath);
});

module.exports = router;