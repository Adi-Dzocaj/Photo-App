const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')
const authController = require('../controllers/auth_controller')
const userValidationRules = require('../validation/user_validation')

// Registration route
router.post('/register', userValidationRules.createRules, authController.register)

router.get('/', (req, res, next) => {
    res.send({ success: true, data: { msg: 'Hello, it works! '}})
})

// Login route
router.post('/login', authController.login)

// Photo route
router.use('/photos', auth.basic, require('./photo_route'));

// Album route
router.use('/albums', auth.basic, require('./album_route'))

module.exports = router;
