const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');

router.get('/', (request, response, next) => {
  response.sendFile(path.join(rootDirectoryStr, 'views', 'shop.html'));
});

module.exports = router;
