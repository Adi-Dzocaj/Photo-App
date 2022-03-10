const bcrypt = require('bcrypt')
const debug = require('debug')('photoapp:server');
const { user_model } = require('../models');

const basic = async (req, res, next) => {
    debug("Hello from auth basic");

    // make sure Authorization header exists, otherwise bail
    if (!req.headers.authorization) {
        debug("Authorization header missing");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization required',
        });
    }

    debug("Authorization header: %o", req.headers.authorization); // %o is a placeholder for the trailing parameter that follows

    // split header into "<authSchema> <base64Payload>"
    const [authSchema, base64Payload] = req.headers.authorization.split(' ');

    // if authSchema is not Basic then bail
    if (authSchema.toLowerCase() !== "basic") {
        debug("Authorization isn´t basic");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization required',
        });
    }

    // decode payload from base64 to ascii. I save the content from base64Payload in a Buffer and then convert it into a string and instruct that it should be written in ascii.
    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii'); // decodedPayload = "email:password"

    // split decoded payload into "<email>:<password>"
    const [email, password] = decodedPayload.split(':');
    
    // find the user that is being requested based on the email
    const user = await new user_model({ email }).fetch({ require: false });
    if (!user) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }
    
    // hash the incoming cleartext password that the user inputs using the salt from the database.
    // also compare if the generated hash matches the database hash

    const hash = user.get('password')
    const result = await bcrypt.compare(password, hash);

    if (!result) {
        return res.status(401).send({
            status: 'fail',
            data: 'Authorization failed',
        });
    }

    req.user = user

    next();
}

module.exports = {
    basic,
}