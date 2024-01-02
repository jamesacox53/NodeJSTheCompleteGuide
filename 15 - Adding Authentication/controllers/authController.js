const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

exports.getLoginPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Login',
    pathStr: '/login',
    isAuthenticated: request.session.isAuthenticated
  };
   
  response.render(path.join('auth', 'login.ejs'), optionsObj);
};

exports.getSignupPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Sign Up',
    pathStr: '/signup',
    isAuthenticated: request.session.isAuthenticated
  };
   
  response.render(path.join('auth', 'signup.ejs'), optionsObj);
};

exports.postLogin = (request, response, next) => {
  const emailStr = request.body.email;
  
  // User.findOne({ 'email': emailStr })
  User.findById('658adc8b6b3c20594cdbac51')
  .then(user => _storeUserInSession(user, request))

  function _storeUserInSession(user, request) {
    request.session.user = user;
    request.session.isAuthenticated = true;
    return request.session.save((err) => {
      response.redirect('/');
    });
  }
};

exports.postSignup = (request, response, next) => {
    response.redirect('/');
};

exports.postLogout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect('/');
  })
};