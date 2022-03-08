const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album_controller');
const albumValidationRules = require('../validation/album_validation');

router.get('/', albumController.getAlbums);

router.post('/', albumValidationRules.createRules, albumController.addAlbum);

module.exports = router;