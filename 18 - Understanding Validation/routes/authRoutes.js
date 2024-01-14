const path = require('path');

const authController = require(path.join('..', 'controllers', 'authControllers', 'authController.js'));
const loginController = require(path.join('..', 'controllers', 'authControllers', 'loginController.js'));
const signupController = require(path.join('..', 'controllers', 'authControllers', 'signupController.js'));
const authValidators = require(path.join('..', 'validators', 'authValidators.js'));

const express = require('express');
const router = express.Router();

router.get('/login', loginController.getLoginPage);
router.get('/signup', signupController.getSignupPage);
router.get('/reset/:token', authController.getResetPasswordPage);
router.get('/reset', authController.getResetPage);

router.post('/login', authValidators.loginValidatorsArr, loginController.postLogin);
router.post('/signup', authValidators.signupValidatorsArr, signupController.postSignup);
router.post('/reset', authController.postReset);
router.post('/logout', authController.postLogout);
router.post('/new-password', authController.postNewPassword);

module.exports = router;