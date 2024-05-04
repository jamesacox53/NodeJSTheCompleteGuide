const path = require('path');
const { validationResult } = require('express-validator');

const User = require(path.join('..', 'models', 'user.js'));

exports.getStatus = (request, response, next) => {
    _getStatus();

    function _getStatus() {
        const userID = request.params.userID;

        return User.findById(userID)
        .then(user => _checkUserAndSendResponse(user))
        .catch(err => _error(err));
    }

    function _checkUserAndSendResponse(user) {
        if (!user) {
            const error = new Error('Could not find user.');
            error.u_statusCode = 404;

            throw error;
        }

        return response.status(200).json({
            status: user.status
        });
    }

    function _error(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        next(err);
    }
};

exports.patchStatus = (request, response, next) => {
    _patchStatus();
  
    function _patchStatus() {
      const errors = validationResult(request);
      
      if (!errors.isEmpty())
        return _validationError(errors);
      
      return _editStatus();
    }

    function _validationError(errors) {
        const error = new Error('Validation failed, entered data is incorrect.');
        error.u_statusCode = 422;
        
        throw error;
    }
    
    function _editStatus() {
        const userID = request.userID;
        
        return User.findById(userID)
        .then(user => _checkUserAndEdit(user, userID))
        .then(result => _sendResponse(result))
        .catch(err => _handleError(err));
    }

    function _checkUserAndEdit(user, userID) {
        if (!user) {
            const error = new Error(`Can't find user with ID ${userID}`);
            error.u_statusCode = 422;

            throw error;
        }

        user.status = request.body.status;
        return user.save();
    }

    function _sendResponse(result) {
        return response.status(200).json({
            message: 'User status successfully updated.'
        });
    }

    function _handleError(err) {
        if (!err.u_statusCode)
            err.u_statusCode = 500;

        return next(err);
    }
};