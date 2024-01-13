const path = require('path');

const authController = require(path.join('..', 'controllers', 'authController.js'));
const validators = require(path.join('..', 'validators', 'validators.js'));

const express = require('express');
const router = express.Router();

router.get('/login', authController.getLoginPage);
router.get('/signup', authController.getSignupPage);
router.get('/reset/:token', authController.getResetPasswordPage);
router.get('/reset', authController.getResetPage);

router.post('/login', validators.loginValidatorsArr, authController.postLogin);
router.post('/signup', validators.signupValidatorsArr, authController.postSignup);
router.post('/reset', authController.postReset);
router.post('/logout', authController.postLogout);
router.post('/new-password', authController.postNewPassword);

module.exports = router;