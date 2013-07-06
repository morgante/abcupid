var express = require('express')
		, http = require('http')
		, url = require('url')
		, async = require('async')
		, request = require('request')
		, mongoose = require('mongoose')
		
var pkg = require('./package.json')

var db = require('./helpers/connect')

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

// set up routes
// app.get('/', main.index);
// app.post('/create', main.create);
// app.get('/paste/:id', main.get);
// app.get('/destroy/:id', main.destory);

// start listening
app.listen( process.env.PORT , function() {
  console.log('Express server listening on port ' + process.env.PORT);
});