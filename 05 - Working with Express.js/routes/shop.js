const path = require('path');
const express = require('express');

const router = express.Router();

router.get('/', (request, response, next) => {
    const shopHTMLFilePath = path.join(__dirname, '../', 'views', 'shop.html');

    response.sendFile(shopHTMLFilePath);
});

module.exports = router;