const path = require('path');

exports.getError500Page = (request, response, next) => {
    var optionsObj = {
        path: path,
        pageTitle: 'Error',
        pathStr: '500'
    };

    response.status(500).render(path.join('error', '500.ejs'), optionsObj);
};

exports.getError404Page = (request, response, next) => {
    var optionsObj = {
        path: path,
        pageTitle: 'Page Not Found',
        pathStr: '404'
    };

    response.status(404).render(path.join('error', '404.ejs'), optionsObj);
};