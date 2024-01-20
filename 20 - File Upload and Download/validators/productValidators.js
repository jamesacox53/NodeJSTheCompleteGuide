const { body } = require('express-validator');

const titleValidator = body('title', 'Please enter a valid title')
.isString()
.trim()
.isLength({ min: 3 });

// const imageURLValidator = body('imageURL', 'Please enter a valid URL')
// .isURL();

const priceValidator = body('price', 'Please enter a valid price')
.isFloat();

const descriptionValidator = body('description', 'Please enter a valid description')
.trim()
.isLength({ min: 5, max: 400 });

// exports.productValidatorsArr = [titleValidator, imageURLValidator, priceValidator, descriptionValidator];
exports.productValidatorsArr = [titleValidator, priceValidator, descriptionValidator];