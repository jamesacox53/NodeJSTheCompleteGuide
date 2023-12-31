const path = require('path');

exports.getLoginPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Login',
    pathStr: '/login'
  };
   
  response.render(path.join('auth', 'login.ejs'), optionsObj);
};

exports.postLogin = (request, response, next) => {
  request.session.isLoggedIn = true;
  response.redirect('/');
};