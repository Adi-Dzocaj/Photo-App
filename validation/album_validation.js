const { body } = require('express-validator');
const models = require('../models');

const createRules = [
    body('title').exists().bail().isString().custom(async value => {
		const title = await new models.album_model({ title: value }).fetch({ require: false });
		if (title) {
			return Promise.reject("An album with this title already exists");
		}
		return Promise.resolve();
	}),
];

module.exports = {
    createRules,
}