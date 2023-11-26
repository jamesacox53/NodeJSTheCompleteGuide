const express = require('express');
const router = express.Router();

router.use('/', (request, response, next) => {
    var optionsObj = {
        pageTitle: 'Page Not Found',
        path: ''
    };

    response.status(404).render('404.ejs', optionsObj);
});

module.exports = router;