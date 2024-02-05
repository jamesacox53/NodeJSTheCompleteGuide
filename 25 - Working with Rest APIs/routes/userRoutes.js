const path = require('path');
const express = require('express');

const isAuth = require(path.join('..', 'utils', 'middleware', 'isAuth.js'));
const userController = require(path.join('..', 'controllers', 'userController.js'));
const userValidators = require(path.join('..', 'utils', 'validators', 'userValidators.js'));

const router = express.Router();

router.get('/user/status/:userID', isAuth, userController.getStatus);

router.patch('/user/status', isAuth, userValidators.statusValidatorsArr, userController.patchStatus);

module.exports = router;