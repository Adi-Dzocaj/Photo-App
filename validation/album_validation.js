const { body } = require('express-validator');

const createRules = [
    body('title').exists().isLength({ min: 3})
]

const updateRules = [
	body('title').optional().isLength({ min: 3 })
]

const addPhotoToAlbumRules = [
    body('photo_id').exists().isInt({ min: 1 })
]

module.exports = {
    createRules,
	updateRules,
	addPhotoToAlbumRules
}