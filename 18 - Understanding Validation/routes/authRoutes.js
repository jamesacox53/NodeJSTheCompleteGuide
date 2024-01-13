const path = require('path');

const authController = require(path.join('..', 'controllers', 'authControllers', 'authController.js'));
const loginController = require(path.join('..', 'controllers', 'authControllers', 'loginController.js'));
const signupController = require(path.join('..', 'controllers', 'authControllers', 'signupController.js'));
const validators = require(path.join('..', 'validators', 'validators.js'));

const express = require('express');
const router = express.Router();

router.get('/login', loginController.getLoginPage);
router.get('/signup', signupController.getSignupPage);
router.get('/reset/:token', authController.getResetPasswordPage);
router.get('/reset', authController.getResetPage);

router.post('/login', validators.loginValidatorsArr, loginController.postLogin);
router.post('/signup', validators.signupValidatorsArr, signupController.postSignup);
router.post('/reset', authController.postReset);
router.post('/logout', authController.postLogout);
router.post('/new-password', authController.postNewPassword);

module.exports = router;