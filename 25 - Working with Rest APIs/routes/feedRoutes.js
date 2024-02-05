const path = require('path');
const express = require('express');

const isAuth = require(path.join('..', 'utils', 'middleware', 'isAuth.js'));
const feedValidators = require(path.join('..', 'utils', 'validators', 'feedValidators.js'));
const feedController = require(path.join('..', 'controllers', 'feedController.js'));

const router = express.Router();

router.get('/post/:postID', isAuth, feedController.getPost);
router.get('/feed/posts', isAuth, feedController.getPosts);

router.put('/post/:postID', isAuth, feedValidators.editPostValidatorArr, feedController.putEditPost);
router.delete('/post/:postID', isAuth, feedController.deletePost);
router.post('/feed/post', isAuth, feedValidators.createPostValidatorArr, feedController.createPost);

module.exports = router;