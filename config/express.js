// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
	http = require('http'),
	express = require('express'),
	morgan = require('morgan'),
	compress = require('compression'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

// Define the Express configuration method
module.exports = function(db) {
	// Create a new Express application instance
	var app = express();
	
	// Create a new HTTP server
    var server = http.createServer(app);

	// Use the 'NDOE_ENV' variable to activate the 'morgan' logger or 'compress' middleware
	if (process.env.NODE_ENV === 'development') {
		app.use(morgan('dev'));
	} else if (process.env.NODE_ENV === 'production') {
		app.use(compress());
	}

	// Use the 'body-parser' and 'method-override' middleware functions
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());


	// Set the application view engine and 'views' folder
	app.set('views', './app/views');
	app.set('view engine', 'jade');

	// Load the routing files
	require('../app/routes/index.server.routes.js')(app);

	// Configure static file serving
	app.use(express.static('./public/dist'));
	
	// Return the Server instance
	return server;
};