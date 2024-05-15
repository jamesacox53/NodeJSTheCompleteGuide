import express from 'express';

import signUpController from '../controllers/authControllers/signUpController.js';
import loginController from '../controllers/authControllers/loginController.js';
import authValidators from '../utils/validators/authValidators.js';

const router = express.Router();

router.put('/auth/signup', authValidators.signupValidatorsArr, signUpController.putSignUp);
router.post('/auth/login', authValidators.loginValidatorsArr, loginController.postLogin);

export default router;