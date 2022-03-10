-- Created a database named 'photoapp' via PHPmyadmin, selected the database, and ran the following SQL

CREATE TABLE Users (
    id INTEGER NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL, 
    email VARCHAR(255) NOT NULL,
    password VARCHAR(200) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Albums (
	id INTEGER NOT NULL AUTO_INCREMENT,
	user_id INTEGER NOT NULL,
	title VARCHAR(100) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE Photos (
	id INTEGER NOT NULL AUTO_INCREMENT,
	user_id INTEGER NOT NULL,	
	title VARCHAR(100) NOT NULL,
	url VARCHAR(500) NOT NULL,
	comment VARCHAR(255) DEFAULT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE albums_photos (
	id INTEGER NOT NULL AUTO_INCREMENT,
    album_id INTEGER NOT NULL,
    photo_id INTEGER NOT NULL,
    PRIMARY KEY(id)
);