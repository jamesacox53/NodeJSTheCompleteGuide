const path = require('path');
const express = require('express');

const feedValidators = require(path.join('..', 'utils', 'validators', 'feedValidators.js'));
const feedController = require(path.join('..', 'controllers', 'feedController'));

const router = express.Router();

router.get('/feed/posts', feedController.getPosts);

router.post('/feed/post', feedValidators.createPostValidatorArr, feedController.createPost);

module.exports = router;