const path = require('path');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jsonwebtoken = require('jsonwebtoken');

const User = require(path.join('..', '..', 'models', 'user.js'));
const jsonWebTokenSecretStr = require(path.join('..', '..', 'sensitive', 'jsonWebTokenSecretStr.js'));

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
      .then(user => _loginUser(user, loginObj))
      .catch(err => _handleError(err));
    }
      
    function _loginUser(user, loginObj) {
      if (!user) {
        return response.status(401).json({
            message: "User doesn't exist."
        });
      }
  
      return _isCorrectPassword(user, loginObj)
      .then(isCorrect => _sendLoginResponse(isCorrect, user));
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
      const payloadObj = {
        email: user.email,
        userId: user._id.toString()
      };

      const optionsObj = {
        expiresIn: '1h'
      };

      const token = jsonwebtoken.sign(payloadObj, jsonWebTokenSecretStr, optionsObj);

      return response.status(201).json({
        token: token,
        userId: user._id.toString()
      }); 
    }
  
    function _handleError(err) {
      if (!err.u_statusCode)
        err.u_statusCode = 500;
  
      return next(err);
    }
};