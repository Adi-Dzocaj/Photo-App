const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller')
const userValidationRules = require('../validation/user_validation');

// CREATE
router.post('/', userValidationRules.createRules, userController.store)

// READ
router.get('/', userController.index)

module.exports = router;