const path = require('path');

exports.getError404Page = (request, response, next) => {
    var optionsObj = {
        path: path,
        pageTitle: 'Page Not Found',
        pathStr: '404',
        isAuthenticated: request.session.isAuthenticated
    };

    response.status(404).render(path.join('error', '404.ejs'), optionsObj);
};