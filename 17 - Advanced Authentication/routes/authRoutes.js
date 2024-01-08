const path = require('path');
const authController = require(path.join('..', 'controllers', 'authController.js'));

const express = require('express');
const router = express.Router();

router.get('/login', authController.getLoginPage);
router.get('/signup', authController.getSignupPage);
router.get('/reset', authController.getResetPage);

router.post('/login', authController.postLogin);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);

module.exports = router;