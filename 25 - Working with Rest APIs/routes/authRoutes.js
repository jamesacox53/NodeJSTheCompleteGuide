const path = require('path');
const express = require('express');

const authController = require(path.join('..', 'controllers', 'authController.js'));

const router = express.Router();

router.put('/auth/signup', authController.signup);

module.exports = router;