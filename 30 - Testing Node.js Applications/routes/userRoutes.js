import express from 'express';

import isAuth from '../utils/middleware/isAuth.js';
import userController from '../controllers/userController.js';
import userValidators from '../utils/validators/userValidators.js';

const router = express.Router();

router.get('/user/status/:userID', isAuth, userController.getStatus);

router.patch('/user/status', isAuth, userValidators.statusValidatorsArr, userController.patchStatus);

export default router;