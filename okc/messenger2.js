var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var brake = require('brake');
var util = require('util');

function MatchStream(opts) {
	var self = this;

	console.log(opts);

	ReadableStream.call(self, {objectMode: true});

	self._read = function(size) {
		self.push({'test': 'a'});
		self.push({'test': 'b'});
		self.push({'test': 'c'});
		self.push({'test': 'd'});
		self.push(null);
	};
}

util.inherits(MatchStream, ReadableStream);

function ThrottleStream() {
	var self = this;
	var queue = [];
	var delay = 10000;

	DuplexStream.call(self, {objectMode: true});

	function doWrite() {
		if (queue.length < 1) {
			return;
		} else {
			var item = queue.shift();
			self.push(item);
		}
	}

	self._read = function(size) {
		setInterval(doWrite, delay);
	};

	self._write = function(data, encoding, callback) {
		queue.push(data);

		callback();
	};
}

util.inherits(ThrottleStream, DuplexStream);

function SendStream() {
	var self = this;
	var queue = [];

	TransformStream.call(self, {objectMode: true});

	self._transform = function(item, encoding, callback) {
		setTimeout(function() {
			self.push(item);
			callback();
		}, 10);
	};
}

util.inherits(SendStream, TransformStream);

exports.MatchStream = MatchStream;
exports.ThrottleStream = ThrottleStream;
exports.SendStream = SendStream;

exports.messageMany = function(client, templates, options) {

	// var stream = new MessageStream();
	// var throttler = new ThrottleStream();
	// var sender = new SendStream();

	// sender.on('data', function(data) {
	// 	console.log('hello');
	// 	console.log(data);
	// });

	// stream.pipe(throttler).pipe(sender);
};