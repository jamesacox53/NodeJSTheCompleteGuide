const path = require('path');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));
const gmailCredsObj = require(path.join(rootDirectoryStr, 'sensitive', 'gmailCredsObj.js'));
const testEmailAccsObj = require(path.join(rootDirectoryStr, 'sensitive', 'testEmailAccsObj.js'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: gmailCredsObj
});

exports.getSignupPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Sign Up',
    pathStr: '/signup',
    errorMessage: _getErrorMsg('errorMessage', request),
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    fieldErrorsObj: {
      email: false,
      password: false,
      confirmPassword: false
    }
  };
     
  response.render(path.join('auth', 'signup.ejs'), optionsObj);
  
  function _getErrorMsg(errorKey, request) {
    if (!errorKey || !request) return null;
  
    const errorArr = request.flash(errorKey);
    if(errorArr.length < 1) return null;
  
    return errorArr[0];
  }
};

exports.postSignup = (request, response, next) => {
  return _postSignup();
  
  function _postSignup() {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return _renderSignupPage(errors.array());
  
    } else {
      return _signup();
    }
  }
  
  function _renderSignupPage(errorsArr) {
    const optionsObj = {
      path: path,
      pageTitle: 'Sign Up',
      pathStr: '/signup',
      errorMessage: _getErrorMsg(errorsArr),
      oldInput: {
        email: request.body.email,
        password: request.body.password,
        confirmPassword: request.body.confirmPassword
      },
      fieldErrorsObj: _getFieldErrorsObj(errorsArr)
    };
       
    return response.status(422).render(path.join('auth', 'signup.ejs'), optionsObj);
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
      password: false,
      confirmPassword: false
    };
  
    for (let i = 0; i < errorsArr.length; i++) {
      const errorObj = errorsArr[i];
      const path = errorObj['path'];
  
      fieldErrorsObj[path] = true;
    }
  
    return fieldErrorsObj;
  }
  
  function _signup() {
    const signupObj = {
      emailStr: request.body.email,
      passwordStr: request.body.password,
      confirmPasswordStr: request.body.confirmPassword
    };
  
    return _getHashedPassword(signupObj)
    .then(hashedPasswordStr => _createUser(hashedPasswordStr, signupObj))
    .then(user => _sendSignupEmail(user))
    .then(user => _storeUserInSession(user))
    .catch(err => _handleError(err));
  }
  
  function _getHashedPassword(signupObj) {
    const passwordStr = signupObj.passwordStr;
 
    return bcryptjs.hash(passwordStr, 12);
  }
  
  function _createUser(hashedPasswordStr, signupObj) {
    const user = new User({
      email: signupObj.emailStr,
      password: hashedPasswordStr,
      cart: {
        items: []
      }
    });
      
    return user.save();
  }
  
  function _sendSignupEmail(user) {
    const mailOptions = {
      from: testEmailAccsObj.from,
      to: testEmailAccsObj.to,
      subject: "Hello from Nodemailer",
      html: "<h1>You have successfully signed up.</h1>"
    };
  
    transporter.sendMail(mailOptions);
  
    return user;
  }
  
  function _storeUserInSession(user) {
    request.session.user = user;
    request.session.isAuthenticated = true;
    request.session.isLoggedIn = true;
    return request.session.save((err) => {
      response.redirect('/');
    });
  }

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};