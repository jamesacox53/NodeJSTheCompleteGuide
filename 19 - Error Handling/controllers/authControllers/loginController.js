const path = require('path');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));

exports.getLoginPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Login',
    pathStr: '/login',
    errorMessage: _getErrorMsg('errorMessage', request),
    oldInput: {
      email: '',
      password: ''
    },
    fieldErrorsObj: {
      email: false,
      password: false
    }
  };

  response.render(path.join('auth', 'login.ejs'), optionsObj);
  
  function _getErrorMsg(errorKey, request) {
    if (!errorKey || !request) return null;
 
    const errorArr = request.flash(errorKey);
    if(errorArr.length < 1) return null;
  
    return errorArr[0];
  }
};

exports.postLogin = (request, response, next) => {
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return _renderLoginPage(errors.array());

  } else {
    return _login();
  }
  
  function _renderLoginPage(errorsArr) {
    const optionsObj = {
      path: path,
      pageTitle: 'Login',
      pathStr: '/login',
      errorMessage: _getErrorMsg(errorsArr),
      oldInput: {
        email: request.body.email,
        password: request.body.password
      },
      fieldErrorsObj: _getFieldErrorsObj(errorsArr)
    };
         
    return response.status(422).render(path.join('auth', 'login.ejs'), optionsObj);
  }
    
  function _getErrorMsg(errorsArr) {
    const messagesArr = [];
    
    for(let i = 0; i < errorsArr.length; i++) {
      const messageStr = errorsArr[i].msg;
    
      messagesArr.push(messageStr);
    }
    
    return messagesArr.join('. ');
  }

  function _getFieldErrorsObj(errorsArr) {
    const fieldErrorsObj = {
      email: false,
      password: false
    };
  
    for (let i = 0; i < errorsArr.length; i++) {
      const errorObj = errorsArr[i];
      const path = errorObj['path'];
  
      fieldErrorsObj[path] = true;
    }
  
    return fieldErrorsObj;
  }
  
  function _login() {
    const loginObj = {
      emailStr: request.body.email,
      passwordStr: request.body.password
    };
        
    return User.findOne({ 'email': loginObj.emailStr })
    .then(user => _postLogin(user, loginObj))
  }
    
  function _postLogin(user, loginObj) {
    if (!user) {
      const errArr = [{path: 'email', msg: 'Invalid Email Address'}, {path: 'password', msg: 'Invalid Password'}];
      return _renderLoginPage(errArr);
    }

    return _isCorrectPassword(user, loginObj)
    .then(isCorrect => _loginOrRedirect(isCorrect, user));
  }
  
  function _isCorrectPassword(user, loginObj) {
    const userPasswordHashStr = user.password;
    const loginPasswordStr = loginObj.passwordStr;
  
    return bcryptjs.compare(loginPasswordStr, userPasswordHashStr);
  }
  
  function _loginOrRedirect(isCorrect, user) {
    if (!isCorrect) {
      const errArr = [{path: 'email', msg: 'Invalid Email Address'}, {path: 'password', msg: 'Invalid Password'}];
      return _renderLoginPage(errArr);
    }
      
    return _storeUserInSession(user);
  }
  
  function _storeUserInSession(user) {
    request.session.user = user;
    request.session.isAuthenticated = true;
    request.session.isLoggedIn = true;
    return request.session.save((err) => {
      response.redirect('/');
    });
  }
};