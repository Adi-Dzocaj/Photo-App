const express = require('express');
const router = express.Router();
const photoController = require('../controllers/photo_controller')
const photoValidationRules = require('../validation/photo_validation')

// CREATE PHOTO
router.post('/', photoValidationRules.createRules, photoController.addPhoto)

// Get users photos
router.get('/', photoController.getPhotos)

// Get a specific user photo
router.get('/:photoId', photoController.getTargetedPhoto)

// Update users photo
router.put('/:photoId', photoValidationRules.updateRules, photoController.updatePhoto )

module.exports = router;
