var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var util = require('util');

var Message = require('../models/message');
var templates = require('../helpers/templates');

function BrainStream(options) {
	var self = this;

	TransformStream.call(self, {objectMode: true});

	self._transform = function(item, encoding, callback) {
		Message.findOne({to: item.username}, function(err, message) {
			if (err || message) {
				callback();
			} else {
				// haven't messaged them before
				var template = templates.pick({active: true});
				var text = template.body;

				self.push({
					to: item.username,
					message: text,
					template: template.name
				});
				callback();
			}
		});
	};
}

util.inherits(BrainStream, TransformStream);

exports.BrainStream = BrainStream;