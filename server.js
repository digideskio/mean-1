// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'NODE_ENV' variable
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.PORT = process.env.PORT || 3000;

// Load the module dependencies
var mongoose = require('./config/mongoose'),
	express = require('./config/express');

// Create a new Mongoose connection instance
var db = mongoose();

// Create a new Express application instance
var app = express(db);

// Use the Express application instance to listen to the '3000' port
app.listen(process.env.PORT);

// Log the server status to the console
console.log('Server running at http://localhost:' + process.env.PORT + '/');

// Use the module.exports property to expose our Express application instance for external usage
module.exports = app;