const path = require('path');
const errorsController = require(path.join('..', 'controllers', 'errorController.js'));

const express = require('express');
const router = express.Router();

router.get('/500', errorsController.getError500Page);
router.use('/', errorsController.getError404Page);

module.exports = router;