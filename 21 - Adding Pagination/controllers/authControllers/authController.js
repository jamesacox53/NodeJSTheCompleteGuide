const path = require('path');
const bcryptjs = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const rootDirectoryStr = path.dirname(require.main.filename);
const User = require(path.join(rootDirectoryStr, 'models', 'user.js'));
const gmailCredsObj = require(path.join(rootDirectoryStr, 'sensitive', 'gmailCredsObj.js'));
const testEmailAccsObj = require(path.join(rootDirectoryStr, 'sensitive', 'testEmailAccsObj.js'));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: gmailCredsObj
});

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
    .catch(err => _handleError(err));
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

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
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
  .catch(err => _handleError(err));

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

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
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
  .catch(err => _handleError(err));

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

  function _handleError(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(err);
  }
};