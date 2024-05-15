import { body } from 'express-validator';

const titleValidator = body('title', 'Title is invalid.').trim().isLength({ min: 5 });

const contentValidator = body('content', 'Content is invalid.').trim().isLength({ min: 5 });

const createPostValidatorArr = [titleValidator, contentValidator];
const editPostValidatorArr = [titleValidator, contentValidator];

export default { createPostValidatorArr, editPostValidatorArr };