// Invoke 'strict' JavaScript mode
'use strict';

// Define the routes module' method
module.exports = function(app) {
	// Load the 'index' controller
	var index = require('../controllers/index.server.controller')

	// Mount the 'index' controller's 'render' method
	app.get('/', index.topTen, index.battle);
	app.get('/battle/:winner/:loser', index.battled);
	app.get('/detail/:id', index.topTen, index.detail);
	app.get('/top', index.topTen, index.topHundred);
	app.get('/skanky', index.topTen, index.bottomHundred);
};