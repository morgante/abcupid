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

	opts = _.defaults(opts, {
		url: 'https://www.okcupid.com/match',
		fake: false
	});

	this.opts = opts;
	this.client = opts.client;
	this.url = opts.url;

	ReadableStream.call(self, {objectMode: true});

	self._read = function(size) {
		if (self.opts.fake) {
			self.push({
				username: 'cosmic-reaction'
			});
			self.push(null);
		} else {
			self.client.matchSearch({
				searchUrl: self.url,
			}, function(results) {
				async.each(results.slice(0,1), function(username, cb) {
					self.client.getProfile(username, function(profile) {
						self.push(profile);
						cb(null);
					});
				}, function(err) {
					// finish the stream
					// self.push(null);
				});
			});
		}
	};
}

util.inherits(MatchStream, ReadableStream);

exports.MatchStream = MatchStream;