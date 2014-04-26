var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var util = require('util');

var Message = require('../models/message');

// just store templates here for now...
var templates = {
	'sup': 'sup babe',
	'what-new': 'What\'s new?',
	'going': 'Hey there, how\'s it going?',
	'pretty-cool': 'Your profile is pretty cool... but are you? What is the coolest thing you\'ve done lately?',
	'quick-question': 'Quick question - what do you expect out of OKCupid matches?',
	'taste': 'Wow, you have incredible taste. I wish I were as cool as you... maybe you can teach me?' // sooo dumb
};

function BrainStream(options) {
	var self = this;

	TransformStream.call(self, {objectMode: true});

	self._transform = function(item, encoding, callback) {
		Message.findOne({to: item.username}, function(err, message) {
			if (err || message) {
				callback();
			} else {
				// haven't messaged them before
				var template = _.sample(_.keys(templates));
				var text = templates[template];

				self.push({
					to: item.username,
					message: text,
					template: template
				});
				callback();
			}
		});
	};
}

util.inherits(BrainStream, TransformStream);

exports.BrainStream = BrainStream;