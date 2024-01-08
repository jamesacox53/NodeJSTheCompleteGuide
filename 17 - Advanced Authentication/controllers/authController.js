const path = require('path');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));
const gmailCredsObj = require(path.join(rootDirectoryStr, 'sensitive', 'gmailCredsObj.js'));
const testEmailAccsObj = require(path.join(rootDirectoryStr, 'sensitive', 'testEmailAccsObj.js'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: gmailCredsObj
});

exports.getLoginPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Login',
    pathStr: '/login',
    userDoesntExistErr: _getErrorMsg('userDoesntExistErr', request)
  };
   
  response.render(path.join('auth', 'login.ejs'), optionsObj);

  function _getErrorMsg(errorKey, request) {
    if (!errorKey || !request) return null;

    const errorArr = request.flash(errorKey);
    if(errorArr.length < 1) return null;

    return errorArr[0];
  }
};

exports.getSignupPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Sign Up',
    pathStr: '/signup',
    userAlreadyExistErr: _getErrorMsg('userAlreadyExistErr', request)
  };
   
  response.render(path.join('auth', 'signup.ejs'), optionsObj);

  function _getErrorMsg(errorKey, request) {
    if (!errorKey || !request) return null;

    const errorArr = request.flash(errorKey);
    if(errorArr.length < 1) return null;

    return errorArr[0];
  }
};

exports.postLogin = (request, response, next) => {
  const loginObj = {
    emailStr: request.body.email,
    passwordStr: request.body.password
  };
  
  User.findOne({ 'email': loginObj.emailStr })
  .then(user => _postLogin(user, loginObj, request, response))
  
  function _postLogin(user, loginObj, request, response) {
    if (!user) {
      request.flash('userDoesntExistErr', 'Invalid Email Address or Password');
      return response.redirect('/login');
    }

    return _isCorrectPassword(user, loginObj)
    .then(isCorrect => _loginOrRedirect(isCorrect, user, request, response));
  }

  function _isCorrectPassword(user, loginObj) {
    const userPasswordHashStr = user.password;
    const loginPasswordStr = loginObj.passwordStr;

    return bcryptjs.compare(loginPasswordStr, userPasswordHashStr);
  }

  function _loginOrRedirect(isCorrect, user, request, response) {
    if (!isCorrect) {
      request.flash('userDoesntExistErr', 'Invalid Email Address or Password');
      return response.redirect('/login');
    }
    
    return _storeUserInSession(user, request, response);
  }

  function _storeUserInSession(user, request, response) {
    request.session.user = user;
    request.session.isAuthenticated = true;
    request.session.isLoggedIn = true;
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
  .then(user => _postSignup(user, signupObj, request, response))
  .catch(err => console.log(err));

  function _postSignup(user, signupObj, request, response) {
    if (user) {
      request.flash('userAlreadyExistErr', 'Email Address already exists');
      return response.redirect('/signup');
    }

    return _getHashedPassword(signupObj)
    .then(hashedPasswordStr => _createUser(hashedPasswordStr, signupObj))
    .then(user => _sendSignupEmail(user))
    .then(user => _storeUserInSession(user, request, response))
    .catch(err => console.log(err));
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
      text: "You have successfully signed up.",
      html: "<h1>You have successfully signed up.</h1>"
    };

    transporter.sendMail(mailOptions);

    return user;
  }

  function _storeUserInSession(user, request, response) {
    request.session.user = user;
    request.session.isAuthenticated = true;
    request.session.isLoggedIn = true;
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