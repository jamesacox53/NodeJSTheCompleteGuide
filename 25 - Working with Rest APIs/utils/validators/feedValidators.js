const path = require('path');
const { body } = require('express-validator');

const titleValidator = body('title', 'Title is invalid.').trim().isLength({ min: 5 });

const contentValidator = body('content', 'Content is invalid.').trim().isLength({ min: 5 });

exports.createPostValidatorArr = [titleValidator, contentValidator];