const path = require('path');
const express = require('express');

const router = express.Router();

router.use('/', (request, response, next) => {
    const error404HTMLFilePath = path.join(__dirname, '../', 'views', 'error404page.html');

    response.status(404).sendFile(error404HTMLFilePath);
});

module.exports = router;