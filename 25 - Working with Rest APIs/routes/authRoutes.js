const path = require('path');
const express = require('express');

const signUpController = require(path.join('..', 'controllers', 'authControllers', 'signUpController.js'));
const authValidators = require(path.join('..', 'utils', 'validators', 'authValidators.js'));

const router = express.Router();

router.put('/auth/signup', authValidators.signupValidatorsArr, signUpController.putSignUp);

module.exports = router;