const path = require('path');
const { body } = require('express-validator');

const User = require(path.join('..', '..', 'models', 'user.js'));

const emailValidator = body('email', 'Please enter a valid email')
.trim().isEmail().normalizeEmail();

const emailAlreadyExistsValidator = body('email')
.custom((value, { req }) => {
    
    return User.findOne({ email: value })
    .then(user => _doesEmailAlreadyExist(user));

    function _doesEmailAlreadyExist(user) {
        if (user)
            return Promise.reject('Email Address already exists');
    }
});

const passwordValidator = body('password', 
'Please enter a password with only numbers and text that is at least 5 characters')
.trim()
.isLength({ min: 5 })
.isAlphanumeric();

const nameValidator = body('name', 
'Please enter a name that is at least 2 characters')
.trim()
.isLength({ min: 2 });

exports.loginValidatorsArr = [emailValidator, passwordValidator];
exports.signupValidatorsArr = [emailValidator, emailAlreadyExistsValidator, passwordValidator, nameValidator];