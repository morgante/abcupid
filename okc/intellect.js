var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var brake = require('brake');
var util = require('util');

function BrainStream(options) {
	var self = this;

	TransformStream.call(self, {objectMode: true});

	self._transform = function(item, encoding, callback) {
		setTimeout(function() {
			self.push({
				username: item.username,
				message: 'Hey there! What is up?',
				template: 'some-special'
			});
			callback();
		}, 10);
	};
}

util.inherits(BrainStream, TransformStream);

exports.BrainStream = BrainStream;