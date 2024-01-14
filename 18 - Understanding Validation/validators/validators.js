const path = require('path');
const { body } = require('express-validator');

const User = require(path.join('..', 'models', 'user.js'));

const emailValidator = body('email', 'Please enter a valid email')
.isEmail().normalizeEmail();

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

const confirmPasswordValidator = body('confirmPassword')
.trim()
.custom((value, { req }) => {
    if (value !== req.body.password)
        throw new Error('Password and Confirm Password have to match');
    
    return true;
});

exports.emailValidator = emailValidator;
exports.passwordValidator = passwordValidator;
exports.loginValidatorsArr = [emailValidator, passwordValidator];
exports.signupValidatorsArr = [emailValidator, emailAlreadyExistsValidator, passwordValidator, confirmPasswordValidator];