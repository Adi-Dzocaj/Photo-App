const debug = require('debug')('photoapp:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// /POST - create a new album
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

// /GET - read all the albums of a user
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

// PUT - update a user's album
const updateAlbum = async (req, res) => {

	const albumId = req.params.albumId;

	// Make sure the album exists
	const album = await new models.album_model({ id: albumId }).fetch({ require: false })
	if (!album) {
		debug("The album to update could not be found. %o", { id: albumId });
		res.status(404).send({
			status: 'fail',
			data: 'The requested album could not be found',
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
    await album.save(validData);

    res.send({
    status: 'success',
    data: {
        album
	}});

	} catch (error) {
    res.status(500).send({
		status: 'error',
		message: 'Exception thrown in database when updating an album.',
    });
    throw error;
	}
}

module.exports = {
    getAlbums,
    addAlbum,
	updateAlbum
}