const { body } = require('express-validator');

const createRules = [
	body('title').exists(),
	body('url').exists().isURL(),
	body('comment').optional()
];

module.exports = {
	createRules,
};