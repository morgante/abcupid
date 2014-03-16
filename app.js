var express = require('express')
		, http = require('http')
		, url = require('url')
		, async = require('async')
		, request = require('request')
		, mongoose = require('mongoose')
		, passport = require('passport')
		, LocalStrategy = require('passport-local').Strategy
		
var pkg = require('./package.json')

var db = require('./helpers/connect')

var main = require('./routes/main');
var templates = require('./routes/templates')
var users = require('./routes/users')
var inbox = require('./routes/inbox')
var tests = require('./tests/index');

var OkCupidUser = require('./models/okcupiduser')

// Passport session setup.
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    OkCupidUser.findById(id, function (err, user) {
        done(err, user);
    });
});

// Use the LocalStrategy within Passport.
passport.use(new LocalStrategy(function(username, password, done) {
    OkCupidUser.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }

        if( user.comparePassword( password ) )
        {
            return done(null, user);
        }
        else
        {
            return done(null, false, { message: 'Invalid password' });
        }
    });
}));

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
}

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
	
	app.use(passport.initialize());
	app.use(passport.session());
	
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));	
});

tests.messageMany();

// set up routes
app.get('/', ensureAuthenticated, main.index);

app.get('/login', users.login);
app.post('/login', users.execLogin);
app.get('/logout', users.logout);

app.get('/templates', ensureAuthenticated, templates.manage);
app.get('/templates/new', ensureAuthenticated, templates.create);
app.post('/templates/new', ensureAuthenticated, templates.save);
app.get('/templates/:slug', ensureAuthenticated, templates.view);
app.post('/templates/:slug', ensureAuthenticated, templates.save);

app.get('/inbox', ensureAuthenticated, inbox.inbox);
app.get('/batch', ensureAuthenticated, inbox.request);
app.post('/batch', ensureAuthenticated, inbox.batch2);

// app.get('/users', users.list);
// app.get('/users/:username', users.edit);
// app.post('/users/:username', users.save);

// start listening
app.listen( process.env.PORT , function() {
  console.log('Express server listening on port ' + process.env.PORT);
});