const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const authController = require('../controllers/auth_controller')
const userValidationRules = require('../validation/user_validation')

router.use('/users', auth.basic, require('./user_route'));

router.post('/register', userValidationRules.createRules, authController.register)

module.exports = router;
