const path = require('path');
const express = require('express');

const rootDirectoryStr = require('../util/rootDirectory');

const router = express.Router();

router.use('/', (request, response, next) => {
    const error404HTMLFilePath = path.join(rootDirectoryStr, 'views', 'error404page.html');
    response.status(404).sendFile(error404HTMLFilePath);
});

module.exports = router;