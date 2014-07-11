var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var util = require('util');

function ThrottleStream() {
	var self = this;
	var queue = [];
	var delay = 1000;

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

function SendStream(opts) {
	var self = this;

	opts = _.defaults(opts, {
		client: null
	});

	this.opts = opts;
	this.client = opts.client;

	WritableStream.call(self, {objectMode: true});

	self._write = function(item, encoding, callback) {
		self.client.message(item.to, item.message, function(err, data) {
			if (err) {
				console.log('error sending message', err);
			} else {
				callback();
			}
		});
	};
}

util.inherits(SendStream, WritableStream);

exports.ThrottleStream = ThrottleStream;
exports.SendStream = SendStream;