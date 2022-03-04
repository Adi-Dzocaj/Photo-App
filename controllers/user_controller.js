const debug = require('debug')('photoapp:user_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// CREATE
const store = async (req, res) => {
    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

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

// READ
const index = async (req, res) => {
	const all_users = await models.user_model.fetchAll();

	res.send({
		status: 'successful',
		data: {
			users: all_users
		}
	});
}

module.exports = {
    store,
    index
}