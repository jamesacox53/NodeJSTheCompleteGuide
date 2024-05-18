import bcryptjs from 'bcryptjs'; 
import { validationResult } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';

import User from '../../models/user.js';
import jsonWebTokenSecretStr from '../../sensitive/jsonWebTokenSecretStr.js';

const postLogin = (request, response, next) => {
    return _postLogin();

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
    
      return _getUser(loginObj)
      .then(user => _loginUser(user, loginObj))
      .catch(err => _handleError(err));  
    }

    // I did this, I'm not sure if it's correct
    function _getUser(loginObj) {
      return new Promise((resolve, reject) => {
        try {
          User.findOne({ 'email': loginObj.emailStr })
          .then(user => resolve(user))
          .catch(err => reject(err));

        } catch (err) {
          reject(err);
        }
      });
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

export default { postLogin };