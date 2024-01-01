const path = require('path');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

exports.getLoginPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Login',
    pathStr: '/login'
  };
   
  response.render(path.join('auth', 'login.ejs'), optionsObj);
};

exports.postLogin = (request, response, next) => {
  const emailStr = request.body.email;
  
  // User.findOne({ 'email': emailStr })
  User.findById('658adc8b6b3c20594cdbac51')
  .then(user => _storeUserInSession(user, request))
  .then(err => _redirectToRoot(response));

  function _storeUserInSession(user, request) {
    request.session.user = user;
    request.session.isLoggedIn = true;
  }
  
  function _redirectToRoot(response) {
    response.redirect('/');
  }
};

exports.postLogout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect('/');
  })
};