var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var brake = require('brake');
var util = require('util');
var Profile = require('../models/profile');

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
				username: 'Staciamegan'
			});
			self.push(null);
		} else {
			self.client.matchSearch({
				searchUrl: self.url,
			}, function(results) {
				_.each(results, function(username, cb) {
					self.push({username: username});
				});
			});
		}
	};
}

util.inherits(MatchStream, ReadableStream);

function FilterStream(options) {
	var self = this;

	TransformStream.call(self, {objectMode: true});

	self._transform = function(item, encoding, callback) {
		Profile.findOne({username: item.username}, function(err, message) {
			if (err || message) {
				callback();
			} else {
				// haven't messaged them before
				self.push({
					username: item.username
				});
				callback();
			}
		});
	};
}

util.inherits(FilterStream, TransformStream);

function ProfileStream(options) {
	var self = this;

	options = _.defaults(options, {
		fake: false
	});

	this.options = options;
	this.client = options.client;

	TransformStream.call(self, {objectMode: true});

	self._transform = function(item, encoding, callback) {
		if (self.options.fake) {
			self.push({
				username: 'Staciamegan',
				lastContacted: null,
				essays: {
					essay_0: 'Hi my name Is \n Say more to me!',
					essay_1: 'I just finished Beauty school and looking for a job.',
					essay_2: 'pretty much Cooking and baking, singing, helping others, making\npeople laugh and put a smile on their face :D',
					essay_3: 'My big eyes and my sparkling personality',
					essay_4: 'Ummm lots and lots ..',
					essay_5: 'well first off\nGod\nfamily\nfriends\nmy puppy\nmy phone\nBatman lol',
					essay_6: 'What I\'m going to do with my life and things that I want to\naccomplish.',
					essay_7: 'At home spending time with family or friends',
					essay_8: 'um I would say I sing in the shower and sing along to songs I know\nin the car lol',
					essay_9: 'you wanna know more about me (:'
				}
			});
			self.push(null);
		} else {
			self.client.getProfile(item.username, function(profile) {
				self.push(profile);
				callback();
			});
		}
	};
}

util.inherits(ProfileStream, TransformStream);

exports.MatchStream = MatchStream;
exports.FilterStream = FilterStream;
exports.ProfileStream = ProfileStream;