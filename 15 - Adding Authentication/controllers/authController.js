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
  
  // User.findById('658adc8b6b3c20594cdbac51')
  User.findOne({ 'email': emailStr })
  .then(user => _ifUserDoesntExistGotoSignupPage(user, response))
  .then(user => _storeUserInSession(user, request, response));

  function _ifUserDoesntExistGotoSignupPage(user, response) {
    if (!user)
      response.redirect('/signup');

      return user;
  }

  function _storeUserInSession(user, request, response) {
    if (!user) return;
    
    request.session.user = user;
    request.session.isAuthenticated = true;
    return request.session.save((err) => {
      response.redirect('/');
    });
  }
};

exports.postSignup = (request, response, next) => {
  const signupObj = {
    emailStr: request.body.email,
    passwordStr: request.body.password,
    confirmPasswordStr: request.body.confirmPassword
  };
  
  User.findOne({ email: signupObj.emailStr })
  .then(user => _ifUserExistsGotoSignupPage(user, response))
  .then(redirected => _createUser(redirected, signupObj))
  .then(user => _storeUserInSession(user, request, response))
  .catch(err => console.log(err));

  function _ifUserExistsGotoSignupPage(user, response) {
    if (user) {
      response.redirect('/signup');
      return true;
    }

    return false;
  }

  function _createUser(redirected, signupObj) {
    if (redirected) return;

    const user = new User({
      email: signupObj.emailStr,
      password: signupObj.passwordStr,
      cart: {
        items: []
      }
    });
    
    return user.save();
  }

  function _storeUserInSession(user, request, response) {
    if (!user) return;

    request.session.user = user;
    request.session.isAuthenticated = true;
    return request.session.save((err) => {
      response.redirect('/');
    });
  }
};

exports.postLogout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect('/');
  })
};