const path = require('path');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require(path.join('..', '..', 'models', 'user.js'));

exports.postLogin = (request, response, next) => {
    _postLogin();

    function _postLogin() {
        const errors = validationResult(request);
        if (!errors.isEmpty()) 
            return _validationError(errors.array());
  
        return _login();
    }
    
    function _validationError(errors) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.u_statusCode = 422;
        
        throw error;
    }
    
    function _login() {
      const loginObj = {
        emailStr: request.body.email,
        passwordStr: request.body.password
      };
          
      return User.findOne({ 'email': loginObj.emailStr })
      .then(user => _postLogin(user, loginObj))
      .catch(err => _handleError(err));
    }
      
    function _postLogin(user, loginObj) {
      if (!user) {
        return response.status(401).json({
            message: "User doesn't exist."
        });
      }
  
      return _isCorrectPassword(user, loginObj)
      .then(isCorrect => _loginOrRedirect(isCorrect, user));
    }
    
    function _isCorrectPassword(user, loginObj) {
      const userPasswordHashStr = user.password;
      const loginPasswordStr = loginObj.passwordStr;
    
      return bcryptjs.compare(loginPasswordStr, userPasswordHashStr);
    }
    
    function _sendLoginResponse(isCorrect, user) {
      if (!isCorrect) {
        return response.status(401).json({
            message: "Incorrect password for user."
        });
      }
        
      return _sendJWTResponse(user);
    }
    
    function _sendJWTResponse(user) {
        return response.status(201).json({
            message: "Correct user."
        });
    }
  
    function _handleError(err) {
        if (!err.u_statusCode)
          err.u_statusCode = 500;
  
        return next(err);
    }
};