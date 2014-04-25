var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var util = require('util');

function MessageStream(opts) {
	var self = this;

	opts = _.defaults(opts, {
		path: '/messages',
		client: undefined
	});

	this.opts = opts;
	this.client = opts.client;
	this.path = opts.path;

	ReadableStream.call(self, {objectMode: true});

	self._read = function(size) {
		if (self.opts.fake) {
			self.push(null);
		} else {
			console.log('reading inbox');

			self.client.get({
				path: self.path
			}, function(err, data) {
				console.log(err, data);
			});

			// self.client.getInbox({
			// 	url: self.url
			// }, function(messages) {
			// 	console.log(messages);
			// });

			// var url = self.url + '&count=' + self.count;
			// var low = self.page * self.count;

			// if (self.page > 0) {
			// 	url = url + '&low=' + low;
			// }

			// if (low >= self.count) {
			// 	return;
			// }

			// self.page++;

			// // console.log('reading from ' + url);

			// self.client.matchSearch({
			// 	searchUrl: url,
			// }, function(results) {
			// 	_.each(results, function(username, cb) {
			// 		if (self.totalRead < self.opts.count && !_.contains(self.matches, username)) {
			// 			self.matches.push(username);
			// 			self.push({username: username});
			// 			self.totalRead++;
			// 		}
			// 	});

			// 	if (self.totalRead >= self.opts.count) {
			// 		self.push(null);
			// 	}
			// });
		}
	};
}

util.inherits(MessageStream, ReadableStream);

exports.MessageStream = MessageStream;