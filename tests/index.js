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

	var options = {
	};

	console.log('testing message many');

	var matches = new searching.MatchStream({
		client: client,
		fake: true
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

	matches.pause();

	matches.pipe(profiles);
	matches.pipe(brain).pipe(messages);

	matches.on('data', function(data) {
		console.log('found', data);
	});

	brain.on('data', function(data) {
		console.log('thought', data);
	});

	sender.on('data', function(data) {
		console.log('sent', data);
	});

	matches.resume();

	// client.authenticate( username, password, function( success ) {
	// 	var matches = new searching.MatchStream({
	// 		client: client,
	// 		// fake: true
	// 	});

	// 	var brain = new intellect.BrainStream({});
	// 	var throttler = new okc.ThrottleStream({});
	// 	var sender = new okc.SendStream({
	// 		client: client
	// 	});

	// 	matches.pipe(brain);

	// 	matches.on('data', function(data) {
	// 		console.log('found', data);
	// 	});

	// 	brain.on('data', function(data) {
	// 		console.log('thought', data);
	// 	});

	// 	sender.on('data', function(data) {
	// 		console.log('sent', data);
	// 	});
 //    });
};