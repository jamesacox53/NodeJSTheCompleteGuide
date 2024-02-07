const path = require('path');
const express = require('express');

const signUpController = require(path.join('..', 'controllers', 'authControllers', 'signUpController.js'));
const loginController = require(path.join('..', 'controllers', 'authControllers', 'loginController.js'));
const authValidators = require(path.join('..', 'utils', 'validators', 'authValidators.js'));

const router = express.Router();

router.put('/auth/signup', authValidators.signupValidatorsArr, signUpController.putSignUp);
router.post('/auth/login', authValidators.loginValidatorsArr, loginController.postLogin);

module.exports = router;