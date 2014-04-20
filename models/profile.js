var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var _ = require('underscore');
var async = require('async');
var Stream = require('stream');
var ReadableStream = Stream.Readable;
var WritableStream = Stream.Writable;
var TransformStream = Stream.Transform;
var DuplexStream = Stream.Duplex;
var util = require('util');

var profileSchema = new Schema({
	username		: {type: String},
	date			: {type: Date, default: Date.now},
	essays			: {type: Schema.Types.Mixed},
	status			: {type: String, default: 'active'},
	lastContacted	: {type: Date}
});

function SaveStream(options) {
	var self = this;

	options = _.defaults(options, {
		model: null,
	});

	self.options = options;
	self.model = options.model;

	WritableStream.call(self, {objectMode: true});

	self._write = function(item, encoding, callback) {
		self.model.update({
			username: item.username
		}, {
			username: item.username,
			essays: item.essays,
			lastContacted: item.lastContacted
		}, {
			upsert: true,
		}, function(err) {
			// console.log('saved', item);
			callback();
		});
	};
}

util.inherits(SaveStream, WritableStream);

profileSchema.statics.makeStream = function(options) {
   options.model = this;

   return new SaveStream(options);
};


module.exports = mongoose.model("Profile", profileSchema);