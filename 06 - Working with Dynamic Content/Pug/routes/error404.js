const path = require('path');

const express = require('express');
const router = express.Router();

const rootDirectoryStr = require('../util/rootDirectory');

router.use('/', (request, response, next) => {
    var optionsObj = {
        pageTitle: 'Page Not Found',
        path: ''
    };

    response.status(404).render('404.pug', optionsObj);
});

module.exports = router;