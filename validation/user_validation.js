const { body } = require('express-validator');
const models = require('../models');

const createRules = [
    body('email').exists().isEmail().custom(async value => {
        const email = await new models.user_model({ email: value }).fetch({ require: false });
        if (email) {
            return Promise.reject("An account is already registered via this email");
        }

        return Promise.resolve();
    }),
    body('password').exists().isLength({ min: 6 }),
    body('first_name').exists().isLength({ min: 3 }),
    body('last_name').exists().isLength({ min: 3 }),
];

const updateRules = [
    body('password').optional().isLength({ min: 6 }),
    body('first_name').optional().isLength({ min: 3 }),
    body('last_name').optional().isLength({ min: 3 }),
];

module.exports = {
    createRules,
    updateRules,
}
