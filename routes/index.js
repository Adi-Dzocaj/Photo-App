const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const authController = require('../controllers/auth_controller')
const userValidationRules = require('../validation/user_validation')

// Register
router.post('/register', userValidationRules.createRules, authController.register)

// Get user
router.use('/user', auth.basic, require('./user_route'));

// Photos
router.use('/photos', auth.basic, require('./photo_route'));

module.exports = router;
