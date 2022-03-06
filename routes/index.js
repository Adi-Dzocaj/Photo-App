const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth')

router.use('/users', auth.basic, require('./user_route'));

module.exports = router;
