var api = require('../okc/api');
var okc = require('../okc/messenger2');
var searching = require('../okc/searching');
var intellect = require('../okc/intellect');

var Message = require('../models/message');
var Profile = require('../models/profile');

exports.messageMany = function() {
	var username = process.env.TEST_USERNAME;
	var password = process.env.TEST_PASSWORD;

	var client = api.createClient();

	client.authenticate( username, password, function( success ) {
		var matches = new searching.MatchStream({
			client: client
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
			from: username
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
			console.log('matched', data);
		});

		throttler.on('data', function(data) {
			console.log('send?', data);
		});
    });
};