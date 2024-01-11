const path = require('path');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
/*const checkObj = expressValidator.check;
const { validationResult } = checkObj;
*/
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
    errorMessage: _getErrorMsg('errorMessage', request)
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
    errorMessage: _getErrorMsg('errorMessage', request)
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
      request.flash('errorMessage', 'Invalid Email Address or Password');
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
      request.flash('errorMessage', 'Invalid Email Address or Password');
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
      errorMessage: _getErrorMsg(errorsArr)
    };
     
    return response.status(422).render(path.join('auth', 'signup.ejs'), optionsObj);
  }

  function _getErrorMsg(errorsArr) {
    return errorsArr.join('. ');
  }

  function _signup() {
    const signupObj = {
      emailStr: request.body.email,
      passwordStr: request.body.password,
      confirmPasswordStr: request.body.confirmPassword
    };

    User.findOne({ email: signupObj.emailStr })
    .then(user => _signupUser(user, signupObj))
    .catch(err => console.log(err));
  }

  function _signupUser(user, signupObj) {
    if (user) {
      request.flash('errorMessage', 'Email Address already exists');
      return response.redirect('/signup');
    }

    return _getHashedPassword(signupObj)
    .then(hashedPasswordStr => _createUser(hashedPasswordStr, signupObj))
    .then(user => _sendSignupEmail(user))
    .then(user => _storeUserInSession(user))
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
};

exports.postLogout = (request, response, next) => {
  request.session.destroy(() => {
    response.redirect('/');
  })
};

exports.getResetPage = (request, response, next) => {
  const optionsObj = {
    path: path,
    pageTitle: 'Reset Password',
    pathStr: '/reset',
    errorMessage: _getErrorMsg('errorMessage', request)
  };
   
  response.render(path.join('auth', 'reset.ejs'), optionsObj);

  function _getErrorMsg(errorKey, request) {
    if (!errorKey || !request) return null;

    const errorArr = request.flash(errorKey);
    if(errorArr.length < 1) return null;

    return errorArr[0];
  }
};

exports.postReset = (request, response, next) => {
  crypto.randomBytes(32, (err, buffer) => _postReset(err, buffer, request, response));

  function _postReset(err, buffer, request, response) {
    if (err) {
      return response.redirect('/reset');
    }

    const token = buffer.toString('hex');
    const emailStr = request.body.email;
    if (!emailStr) return;

    return User.findOne({ email: emailStr })
    .then(user => _setResetToken(user, token, request, response))
    .catch(err => console.log(err));
  }

  function _setResetToken(user, token, request, response) {
    if (!user) {
      request.flash('errorMessage', "The user doesn't exist");
      return response.redirect('/reset');
    }

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 360000;
    return user.save()
    .then(user => _sendResetEmail(user, response));
  }

  function _sendResetEmail(user, response) {
    const mailOptions = {
      from: testEmailAccsObj.from,
      to: testEmailAccsObj.to,
      subject: "Password Reset",
      html: `<p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/reset/${user.resetToken}">link</a> to set a new password</p>`
    };
  
    transporter.sendMail(mailOptions);
    return response.redirect('/');
  }
};

exports.getResetPasswordPage = (request, response, next) => {
  const token = request.params.token;
  const whereObj = {
    resetToken: token,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  };

  User.findOne(whereObj)
  .then(user => _getResetPasswordPage(user, response, token))
  .catch(err => console.log(err));

  function _getResetPasswordPage(user, response, token) {
    if (!user) {
      return response.redirect('/');
    }

    const optionsObj = {
      path: path,
      pageTitle: 'Reset Password',
      pathStr: '/reset',
      passwordToken: token,
      userID: user._id.toString()
    };
     
    response.render(path.join('auth', 'reset-password.ejs'), optionsObj);
  }

  function _getErrorMsg(errorKey, request) {
    if (!errorKey || !request) return null;

    const errorArr = request.flash(errorKey);
    if(errorArr.length < 1) return null;

    return errorArr[0];
  }
};

exports.postNewPassword = (request, response, next) => {
  const newPasswordObj = {
    userID: request.body.userID,
    passwordToken: request.body.passwordToken,
    newPassword: request.body.password
  }

  const whereObj = {
    _id: newPasswordObj.userID,
    resetToken: newPasswordObj.passwordToken,
    resetTokenExpiration: {
      $gt: Date.now()
    }
  };

  User.findOne(whereObj)
  .then(user => _postNewPassword(user, newPasswordObj, response))
  .catch(err => console.log(err));

  function _postNewPassword(user, newPasswordObj, response) {
    if (!user) {
      return response.redirect('/');
    }

    return _getHashedPassword(newPasswordObj)
    .then(hashedPasswordStr => _setNewPassword(hashedPasswordStr, user, response))
    .then(err => _redirectToLoginPage(response));
  }

  function _getHashedPassword(newPasswordObj) {
    const passwordStr = newPasswordObj.newPassword;

    return bcryptjs.hash(passwordStr, 12);
  }

  function _setNewPassword(hashedPasswordStr, user) {
    user.password = hashedPasswordStr;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;

    return user.save();
  }

  function _redirectToLoginPage(response) {
    return response.redirect('/login');
  }
};