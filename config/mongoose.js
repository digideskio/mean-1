// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var	config = require('./config'),
	mongoose = require('mongoose'),
	options = { server: { sockeOptions: { keepAlive: 1 } } };

// Define the Mongoose configuration method
module.exports = function() {
	// Use Mongoose to connect to MongoDB
	var db = mongoose.connect(config.db, options);

	// Load the application models
	require('../app/models/booking.server.model');

	// Return the Mongoose connection instance
	return db;
};