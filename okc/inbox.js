var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var util = require('util');
var fs = require('fs');
var cheerio = require('cheerio');
var path = require('path');

function MessageStream(opts) {
	var self = this;

	opts = _.defaults(opts, {
		path: '/messages',
		client: undefined
	});

	this.opts = opts;
	this.client = opts.client;
	this.username = this.client.username;
	this.path = opts.path;
	this.started = false;

	ReadableStream.call(self, {objectMode: true});

	self._read = function(size) {
		if (self.started) {
			return;
		} else {
			self.started = true;
		}

		if (self.opts.fake) {
			// self.push(null);
		} else {
			console.log('reading inbox');

			self.client.get({
				path: self.path
			}, function(err, data) {
				var $ = cheerio.load(data);

				var threads = $('.thread.message a.open');
				var urls = [];

				threads.each(function(i, elem) {
					elem = $(elem);
					urls.push(elem.attr('href'));
				});

				// urls = urls.slice(0, 10);

				console.log('Got urls... opening');

				async.each(urls, function(url, cb) {
					self.client.get({path: url}, function(err, data) {
						if (err) {
							cb(err);
						} else {
							var $ = cheerio.load(data);

							var messages = $('ul#thread li.from_me'); // only collects messages from others

							messages.each(function(i, elem) {
								try {

									elem = cheerio.load(elem);
									
									var a = $('a.photo', elem);
									var name = a.attr('href').match(/profile\/(.+)\?/i)[1];

									var content = $('.message_body', elem).text();

									var timestamp = elem.html().match(/fancydate_[0-9]+', ([0-9]+)/)[1];
									timestamp =  timestamp * 1000;
									timestamp = new Date(timestamp);

									self.push({
										to: self.username,
										from: name,
										message: content,
										timestamp: timestamp
									});

								}
								catch (err) {
									/// discarding errors...
									console.log(err);
								}
							});
						}
					});
				}, function(err) {
					if (err) {
						console.log(err);
					} else {
						// finish the stream
						self.push(null);
					}

					
				});
			});
		}
	};
}

util.inherits(MessageStream, ReadableStream);

exports.MessageStream = MessageStream;