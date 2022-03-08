const express = require('express');
const router = express.Router();
const userController = require('../controllers/photo_controller')
const photoValidationRules = require('../validation/photo_validation')

// CREATE PHOTO
router.post('/', photoValidationRules.createRules, userController.addPhoto)

// Get users photos
router.get('/', userController.getPhotos)

module.exports = router;
