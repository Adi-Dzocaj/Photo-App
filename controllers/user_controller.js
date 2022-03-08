const debug = require('debug')('photoapp:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// READ - GET USER
const index = async (req, res) => {

	res.send({
		status: 'successful',
		data: {
			user: req.user
		}
	});
}

// GET AUTHENTICATED USERS PHOTOS
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

module.exports = {
    index,
    getPhotos,
    addPhoto
}