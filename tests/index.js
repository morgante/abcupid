var api = require('../okc/api');
var okc = require('../okc/messenger2');
var searching = require('../okc/searching');
var intellect = require('../okc/intellect');

var Message = require('../models/message');

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

	matches.pipe(brain).pipe(messages);

	brain.on('data', function(data) {
		console.log('thought', data);
	});

	sender.on('data', function(data) {
		console.log('sent', data);
	});

	// client.authenticate( username, password, function( success ) {
	// 	var matches = new searching.MatchStream({
	// 		client: client,
	// 		fake: true
	// 	});

	// 	var brain = new intellect.BrainStream({});
	// 	var throttler = new okc.ThrottleStream({});
	// 	var sender = new okc.SendStream({
	// 		client: client
	// 	});

	// 	matches.pipe(brain).pipe(sender);

	// 	brain.on('data', function(data) {
	// 		console.log('thought', data);
	// 	});

	// 	sender.on('data', function(data) {
	// 		console.log('sent', data);
	// 	});
 //    });
};