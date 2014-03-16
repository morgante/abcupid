var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var brake = require('brake');
var util = require('util');

function MessageStream(client) {
	var self = this;

	ReadableStream.call(self, {objectMode: true});

	self._read = function(size) {
		self.push({'test': 'a'});
		self.push({'test': 'b'});
		self.push({'test': 'c'});
		self.push({'test': 'd'});
		self.push(null);
	};
}

util.inherits(MessageStream, ReadableStream);

function SendStream() {
	var self = this;
	var queue = [];
	var delay = 1000;

	WritableStream.call(self, {objectMode: true});

	function doWrite() {
		if (queue.length < 1) {
			return;
		}

		var item = queue.shift();

		console.log(item);
	}

	setInterval(doWrite, delay);

	self._write = function(data, encoding, callback) {
		queue.push(data);
		callback();
	};
}

util.inherits(SendStream, WritableStream);

exports.messageMany = function(client, templates, options) {

	var stream = new MessageStream();
	stream.pipe(new SendStream());
};