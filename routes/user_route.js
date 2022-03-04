const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller')
const userValidationRules = require('../validation/user_validation');

// POST
router.post('/', userValidationRules.createRules, userController.store)

module.exports = router;