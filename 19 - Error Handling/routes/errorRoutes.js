const path = require('path');
const errorsController = require(path.join('..', 'controllers', 'errorController.js'));

const express = require('express');
const router = express.Router();

router.use('/', errorsController.getError404Page);

module.exports = router;