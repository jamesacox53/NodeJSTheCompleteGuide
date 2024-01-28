const path = require('path');
const express = require('express');

const feedController = require(path.join('..', 'controllers', 'feedController'));

const router = express.Router();

router.get('/feed/posts', feedController.getPosts);

module.exports = router;