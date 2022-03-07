const debug = require('debug')('photoapp:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');


// CREATE
const createUser = async (req, res) => {
    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    console.log(matchedData(req))
    // get only the validated data from the request
    const validData = matchedData(req);

    try {
        const user = await new models.user_model(validData).save();
        debug("Created new user successfully: %O", user);

        res.send({
            status: 'success',
            data: {
                user,
            },
        });

    } catch (error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown in database when creating a new user.',
        });
        throw error;
    }
}

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
    const user = await new models.user_model({ id: req.user.id }).fetch({ withRelated: ['photos'] });

    res.status(200).send({
        status: 'success',
        id: {
            id: req.user.id
        },
        data: {
            photo: user.related('photos')
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
    createUser,
    index,
    getPhotos,
    addPhoto
}