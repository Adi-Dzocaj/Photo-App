const debug = require('debug')('photoapp:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// GET AUTHENTICATED USERS ALBUMS
const getAlbums = async (req, res) => {
    const user = await models.user_model.fetchById(req.user.id, {withRelated: ['albums']});

    res.status(200).send({
        status: 'success',
        id: {
            id: user.id
        },
        data: {
            albums: user.related('albums')
        }
    })
}

const addAlbum = async (req, res) => {
	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	validData.user_id = req.user.id;

	try {
		const album = await new models.album_model(validData).save();
		debug('Created new album: %O', album);
		res.send({
			status: 'success',
			data: {
				result: album,
			},
		});
	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown when attempting to add an album.',
		});
		throw error;
	}
};

module.exports = {
    getAlbums,
    addAlbum
}