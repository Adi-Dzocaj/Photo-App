const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller')
const userValidationRules = require('../validation/user_validation');

// CREATE
router.post('/', userValidationRules.createRules, userController.createUser)

// CREATE PHOTO
router.post('/photos', userController.addPhoto)

// READ
router.get('/', userController.index)

router.get('/photos', userController.getPhotos)

module.exports = router;