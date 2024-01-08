module.exports = (request, response, next) => {
    const isLoggedIn = request.session.isLoggedIn;
    const isAuthenticated = request.session.isAuthenticated;
    const crsfToken = request.csrfToken();

    response.locals.isLoggedIn = isLoggedIn;
    response.locals.isAuthenticated = isAuthenticated;
    response.locals.crsfToken = crsfToken;

    next();
}