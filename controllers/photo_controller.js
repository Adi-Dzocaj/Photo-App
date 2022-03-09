const debug = require('debug')('photoapp:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// /POST - create a new photo
const addPhoto = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	validData.user_id = req.user.id;

	try {
		const photo = await new models.photo_model(validData).save();
		debug('Created new photo: %O', photo);
		res.send({
			status: 'success',
			data: {
				result: photo,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when attempting to add an photo.',
		});
		throw error;
	}
};

// /GET - read all the photos of a user
const getPhotos = async (req, res) => {
    const user = await models.user_model.fetchById(req.user.id, {withRelated: ['photos']});

    res.status(200).send({
        status: 'success',
        id: {
            id: user.id
        },
        data: {
            photos: user.related('photos')
        }
    })
}

// PUT - update a user's photo
const updatePhoto = async (req, res) => {

	const photoId = req.params.photoId;

	// Make sure the photo exists
	const photo = await new models.photo_model({ id: photoId }).fetch({ require: false })
	if (!photo) {
		debug("The photo to update could not be found. %o", { id: photoId });
		res.status(404).send({
			status: 'fail',
			data: 'The requested photo could not be found',
    });
    return;
	}

	// check for any validation errors
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	try {
    await photo.save(validData);

    res.send({
    status: 'success',
    data: {
        photo
	}});

	} catch (error) {
    res.status(500).send({
		status: 'error',
		message: 'Exception thrown in database when updating a photo.',
    });
    throw error;
	}
}

module.exports = {
    getPhotos,
    addPhoto,
	updatePhoto
}