const bcrypt = require('bcrypt');
const debug = require('debug')('photoapp:register_controller');
const { matchedData, validationResult } = require('express-validator');
const models = require('../models');

// Registering new users
const register = async (req, res) => {
    // check for any validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({ status: 'fail', data: errors.array() });
    }

    // get only the validated data from the request
    const validData = matchedData(req);

    // Generate a hash of validData.password
    // Overwrite validData.password with the hash
    try {
        validData.password = await bcrypt.hash(validData.password, 10)
    } catch(error) {
        res.status(500).send({
            status: 'error',
            message: 'Exception thrown when hashing the password.',
        });
        throw error;
    }
    try {
        const user = await new models.user_model(validData).save();
        debug("Created new user successfully: %O", user);

        res.send({
            status: 'success',
            data: {
                email: validData.email,
                first_name: validData.first_name,
                last_name: validData.last_name
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

const login = async (req, res) => {
    const { email, password } = req.body

    // login user
    const user = await models.user_model.login(email, password);
    
    if (!user) {
        return res.status(401).send({
            status: "fail",
            data: "Authentication failed.",
        });
    }

    return res.status(200).send({
        status: 'success',
        data: "Login successful!"
    });
};

module.exports = {
    register,
    login
}