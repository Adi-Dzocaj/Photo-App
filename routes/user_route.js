const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller')
const userValidationRules = require('../validation/user_validation');
const photoValidationRules = require('../validation/photo_validation')

// CREATE PHOTO
router.post('/photos', photoValidationRules.createRules, userController.addPhoto)

// READ
router.get('/', userController.index)

router.get('/photos', userController.getPhotos)

module.exports = router;

