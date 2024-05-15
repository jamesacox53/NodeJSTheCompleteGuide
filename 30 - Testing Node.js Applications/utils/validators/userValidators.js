import { body } from 'express-validator';

const statusValidator = body('status', 
'Please enter a status that is at least 1 character.')
.trim()
.isLength({ min: 1 });

const statusValidatorsArr = [statusValidator];

export default { statusValidatorsArr };