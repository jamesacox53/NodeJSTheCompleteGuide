const { body } = require('express-validator');

const emailValidator = body('email', 'Please enter a valid email')
.isEmail();

const passwordValidator = body('password', 
'Please enter a password with only numbers and text and at least 5 characters')
.isLength({ min: 5 })
.isAlphanumeric();

const confirmPasswordValidator = body('confirmPassword')
.custom((value, { req }) => {
    if (value !== req.body.password)
        throw new Error('Password and Confirm Password have to match');
    
    return true;
});

exports.emailValidator = emailValidator;
exports.passwordValidator = passwordValidator;
exports.signupValidatorsArr = [emailValidator, passwordValidator, confirmPasswordValidator];