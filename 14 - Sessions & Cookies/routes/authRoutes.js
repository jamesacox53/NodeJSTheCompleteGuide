const path = require('path');
const authController = require(path.join('..', 'controllers', 'authController.js'));

const express = require('express');
const router = express.Router();

router.get('/login', authController.getLoginPage);

module.exports = router;