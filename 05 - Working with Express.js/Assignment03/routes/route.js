const path = require('path');
const express = require('express');

const rootDirectoryStr = require('../util/rootDirectory');

const router = express.Router();

router.get('/users', (request, response, next) => {
    const usersHTMLFilePath = path.join(rootDirectoryStr, 'views', 'users.html');
    response.sendFile(usersHTMLFilePath);
});

router.get('/', (request, response, next) => {
    const rootHTMLFilePath = path.join(rootDirectoryStr, 'views', 'root.html');
    response.sendFile(rootHTMLFilePath);
});

module.exports = router;