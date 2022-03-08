const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const authController = require('../controllers/auth_controller')
const userValidationRules = require('../validation/user_validation')

// Registration route
router.post('/register', userValidationRules.createRules, authController.register)

// User route
router.use('/user', auth.basic, require('./user_route'));

// Photo route
router.use('/photos', auth.basic, require('./photo_route'));

// Album route
router.use('/albums', auth.basic, require('./album_route'))

module.exports = router;
