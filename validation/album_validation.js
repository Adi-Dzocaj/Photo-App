const { body } = require('express-validator');

const createRules = [
    body('title').exists().isLength({ min: 3})
]

module.exports = {
    createRules,
}