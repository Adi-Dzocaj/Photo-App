const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller')

// READ
router.get('/', userController.index)

module.exports = router;
