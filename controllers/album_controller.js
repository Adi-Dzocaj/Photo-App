const debug = require('debug')('photoapp:album_controller');
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
		res.status(200).send({
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

// /GET - read a specific album of a user and his/her photos, in that album
const getTargetedAlbum = async (req, res) => {
	// fetch user and eager-load albums relation
	const user = await models.user_model.fetchById(req.user.id, { withRelated: ['albums'] });

	// get the authorized users albums and search for the one with the requested /:albumId
	const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);

	// get the album and it's photo relation
	const albumContent = await models.album_model.fetchById(req.params.albumId, {withRelated: ['photos']});

	if (!userAlbum) {
		return res.status(404).send({
			status: 'fail',
			message: `Album with id ${req.params.albumId} couldn't be found`,
		});
	}

	res.status(200).send({
		status: 'success',
		data: {
			album: albumContent
		}
	});
};

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

    res.status(200).send({
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

const addPhotoToAlbum = async (req, res) => {

	// check for any validation errors
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).send({ status: 'fail', data: errors.array() });
	}

	// get only the validated data from the request
	const validData = matchedData(req);

	// fetch user and eager-load albums and photos relation
	const user = await models.user_model.fetchById(req.user.id, {withRelated: ['albums', 'photos']});
	// get the authorized users albums and search for the one with the requested /:albumId
	const userAlbum = user.related('albums').find(album => album.id == req.params.albumId);
	// get the authorized users photos and search for the one with the requested photo_id
	const userPhoto = user.related('photos').find(photo => photo.id == validData.photo_id);
	// get the album and it's photo relation
	const album = await models.album_model.fetchById(req.params.albumId, {withRelated: ['photos']});

	const photoExists = album.related('photos').find(photo => photo.id == validData.photo_id);
	if (photoExists) {
		return res.status(403).send({
			status: 'fail',
			data: "This photo is already in the album"
		});
	}

	if (!userAlbum) {
		res.status(404).send({
			status: 'fail',
			data: "The album you wanted to insert the photo into, couldn't be found"
		});
		return;
	}

	if (!userPhoto) {
		res.status(404).send({
			status: 'fail',
			data: "The photo you wanted to put in the album couldn't be found"
		});
		return;
	}

	try {

		await album.photos().attach(validData.photo_id);
		
		res.status(200).send({
			status: 'success',
			data: `Photo with id: ${validData.photo_id} was successfully placed into album with id: ${req.params.albumId}`,
		});

	} catch (error) {
		res.status(500).send({
			status: 'error',
			message: 'Exception thrown in database when adding a photo to a album.',
		});
		throw error;
	}
}

module.exports = {
    addAlbum,
	getAlbums,
	getTargetedAlbum,
	updateAlbum,
	addPhotoToAlbum
}