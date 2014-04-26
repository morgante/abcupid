var _ = require('underscore');
var async = require('async');

var Message = require('../models/message');

function getStats(cb) {

	var query = Message.find({"template": {"$ne": null, "$exists": true}});

	query.exec(function(err, results) {
		var templates = _.groupBy(results, function(message) {
			return message.template;
		});
		templates = _.map(templates, function(messages, template) {
			return {
				name: template,
				messages: messages
			};
		});

		async.map(templates, function(template, cb) {
			var name = template.name;
			var users = _.pluck(template.messages, 'to');

			var q = Message.find({"from": {"$in": users}});

			q.exec(function(err, results) {

				var replies = _.pluck(results, 'from');
				replies = _.uniq(replies);

				var data = {
					name: name,
					tries: template.messages.length,
					replies: results,
					hits: replies.length,
					rate: replies.length / template.messages.length
				};

				cb(null, data);

			});
		}, function(err, results) {
			cb(err, results);
		});
	});
}

exports.overview = function(req, res) {
	getStats(function(err, stats) {
		res.render('stats', {
			templates: stats
		});
	});
};