var api = require('../okc/api2');
var okc = require('../okc/messenger');
var searching = require('../okc/searching');
var intellect = require('../okc/intellect');

var Message = require('../models/message');
var Profile = require('../models/profile');

var db = require('../helpers/connect');

function messageMany() {
	var args = process.argv.slice(2);

	if (args.length < 2) {
		console.log('Usage: node scripts/send.js username password');
		return;
	}

	var username = args[0];
	var password = args[1];

	var matchUrl = process.env.OKC_MATCH;

	var client = api.createClient();

	client.authenticate( username, password, function( success ) {
		var matches = new searching.MatchStream({
			client: client,
			url: matchUrl
		});

		var filter = new searching.FilterStream({});

		var profiler = new searching.ProfileStream({
			client: client
		});

		var brain = new intellect.BrainStream({});
		var throttler = new okc.ThrottleStream({});
		var sender = new okc.SendStream({
			client: client
		});
		var messages = Message.makeStream({
			owner: username
		});
		var profiles = Profile.makeStream({
		});

		// filter and complete profiles
		var stream = matches.pipe(filter).pipe(profiler);

		// save profiles & choose messages
		stream.pipe(profiles);
		stream.pipe(brain);

		// throttle sending messages
		brain.pipe(throttler);

		// save and send messages
		throttler.pipe(messages);
		throttler.pipe(sender);

		// matches.on('data', function(data) {
			// console.log('found', data.username);
		// });

		stream.on('data', function(data) {
			// console.log('matched', data);
		});

		throttler.on('data', function(data) {
			console.log('send?', data);
		});
    });
}

messageMany();