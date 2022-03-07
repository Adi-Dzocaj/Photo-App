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

    debug("Authorization header: %o", req.headers.authorization); // %o är en placeholder för den efterföljande parametern som jag skickar med. 

    // spilt header into "<authSchema> <base64Payload>"
    // [0] = "Basic"
    // [1] = "koden som omvandlat användarnamn och lösenord"
    const [authSchema, base64Payload] = req.headers.authorization.split(' ');

    // if authSchema is not Basic then bail
    if (authSchema.toLowerCase() !== "basic") {
        debug("Authorization isn´t basic");

        return res.status(401).send({
            status: 'fail',
            data: 'Authorization required',
        });
    }

    // decode payload from base64 to ascii. Först sparas innehållet från base64Payload i en Buffer, och sedan gör jag om detta till en sträng och talar om att det ska skrivas i ascii. 
    const decodedPayload = Buffer.from(base64Payload, 'base64').toString('ascii'); // decodedPayload = "email:password"

    // split decoded payload into "<email>:<password>"
    const [email, password] = decodedPayload.split(':'); // här splittas det som finns i decodedPayload och delas av med :

    const user = await new user_model({email, password}).fetch({ require: false });
    if (!user) {
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