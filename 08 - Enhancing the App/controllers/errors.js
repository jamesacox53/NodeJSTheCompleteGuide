exports.getError404Page = (request, response, next) => {
    var optionsObj = {
        pageTitle: 'Page Not Found',
        path: '404'
    };

    response.status(404).render('404.ejs', optionsObj);
};