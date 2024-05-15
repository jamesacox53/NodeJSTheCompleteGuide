import express from 'express';

import isAuth from '../utils/middleware/isAuth.js';
import feedValidators from '../utils/validators/feedValidators.js';
import feedController from '../controllers/feedController.js';

const router = express.Router();

router.get('/post/:postID', isAuth, feedController.getPost);
router.get('/feed/posts', isAuth, feedController.getPosts);

router.put('/post/:postID', isAuth, feedValidators.editPostValidatorArr, feedController.putEditPost);
router.delete('/post/:postID', isAuth, feedController.deletePost);
router.post('/feed/post', isAuth, feedValidators.createPostValidatorArr, feedController.createPost);

export default router;