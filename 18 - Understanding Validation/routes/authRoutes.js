const path = require('path');
const { check } = require('express-validator');
/*const checkObj = expressValidator.check;
const  = checkObj;
*/
const authController = require(path.join('..', 'controllers', 'authController.js'));
const emailValidation = check('email').isEmail();

const express = require('express');
const router = express.Router();

router.get('/login', authController.getLoginPage);
router.get('/signup', authController.getSignupPage);
router.get('/reset/:token', authController.getResetPasswordPage);
router.get('/reset', authController.getResetPage);

router.post('/login', authController.postLogin);
router.post('/signup', emailValidation, authController.postSignup);
router.post('/reset', authController.postReset);
router.post('/logout', authController.postLogout);
router.post('/new-password', authController.postNewPassword);

module.exports = router;