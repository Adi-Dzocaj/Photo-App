require('dotenv').config();

// Setting up the database connection
const knex = require('knex')({
	debug: true,
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST || 'localhost',
		port: process.env.DB_PORT || 8889,
		charset: process.env.DB_CHARSET || 'utf8mb4',
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
	}
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.album_model = require('./album_model')(bookshelf);
models.user_model = require('./user_model')(bookshelf);
models.photo_model = require('./photo_model')(bookshelf);

module.exports = {
	bookshelf,
	...models,
};