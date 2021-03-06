const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation')

router.post('/', albumValidationRules.createRules, albumController.addAlbum);

router.get('/', albumController.getAlbums);

router.get('/:albumId', albumController.getTargetedAlbum)

router.put('/:albumId', albumValidationRules.updateRules, albumController.updateAlbum)

router.post('/:albumId/photos', albumValidationRules.addPhotoToAlbumRules, albumController.addPhotoToAlbum);

module.exports = router;