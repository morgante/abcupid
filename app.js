var express = require('express')
		, http = require('http')
		, url = require('url')
		, async = require('async')
		, request = require('request')
		, mongoose = require('mongoose')
		, passport = require('passport')
		
var pkg = require('./package.json');

var db = require('./helpers/connect');

var stats = require('./routes/stats');
var main = require('./routes/main');
var feedback = require('./routes/feedback');

var app = express();
// configure Express
app.configure(function() {
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
	app.engine('ejs', require('ejs-locals'));

	app.use(express.logger());
	app.use(express.cookieParser());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.session({ secret: process.env.SECRET }));
	
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
});

// Show stats
app.get('/stats/:username', stats.overview);

// Basic index
app.get('/', main.index);

// Feedback
app.get('/feedback/start', feedback.start);
app.post('/feedback/start', feedback.create);
app.get('/feedback/:id/from/:from', feedback.fill);
app.post('/feedback/:id/from/:from', feedback.give);

// start listening
app.listen( process.env.PORT , function() {
  console.log('Express server listening on port ' + process.env.PORT);
});