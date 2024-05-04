const path = require('path');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');

const User = require(path.join('..', '..', 'models', 'user.js'));

exports.putSignUp = (request, response, next) => {
    return _putSignUp();
    
    function _putSignUp() {
        const errors = validationResult(request);
        if (!errors.isEmpty())
            return _validationError(errors.array());
    
        return _signUp();
    }
    
    function _validationError(errors) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.u_statusCode = 422;
        
        throw error;
    }
    
    function _signUp() {
      const signupObj = {
        emailStr: request.body.email,
        passwordStr: request.body.password,
        nameStr: request.body.name
      };
    
      return _getHashedPassword(signupObj)
      .then(hashedPasswordStr => _createUser(hashedPasswordStr, signupObj))
      .then(user => _sendResponse(user))
      .catch(err => _handleError(err));
    }
    
    function _getHashedPassword(signupObj) {
      const passwordStr = signupObj.passwordStr;
   
      return bcryptjs.hash(passwordStr, 12);
    }
    
    function _createUser(hashedPasswordStr, signupObj) {
        if (!hashedPasswordStr) {
            const error = new Error("Couldn't hash password.");
            error.u_statusCode = 422;
        
            throw error;
        }

        const user = new User({
        email: signupObj.emailStr,
        password: hashedPasswordStr,
        name: signupObj.nameStr,
        status: 'active',
        posts: []
      });
        
      return user.save();
    }

    function _sendResponse(user) {
        return response.status(201).json({
            message: 'User created successfully!',
            userId: user._id.toString()
        });
    }
    
    function _handleError(err) {
      if (!err.u_statusCode)
        err.u_statusCode = 500;

      return next(err);
    }
  };