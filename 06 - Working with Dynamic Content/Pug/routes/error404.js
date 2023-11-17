const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');

router.use('/', (request, response, next) => {
    const error404HTMLFilePath = path.join(rootDirectoryStr, 'views', '404.html');
    response.status(404).sendFile(error404HTMLFilePath);
});

module.exports = router;