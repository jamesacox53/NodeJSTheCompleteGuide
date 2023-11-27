const errorsController = require('../controllers/errors.js');

const express = require('express');
const router = express.Router();

router.use('/', errorsController.getError404Page);

module.exports = router;