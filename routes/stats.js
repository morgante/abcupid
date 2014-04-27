var _ = require('underscore');
var async = require('async');

var Message = require('../models/message');
var templateHelper = require('../helpers/templates');

function getStats(cb) {

	var query = Message.find({"template": {"$ne": null, "$exists": true}});

	query.where('from').equals(process.env.TEST_USERNAME);

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
					text: templateHelper.lookup(name, {active: false}),
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

function getTotal(cb) {
	var query = Message.find({"template": {"$ne": null, "$exists": true}});

	query.where('from').equals(process.env.TEST_USERNAME);

	query.count(cb);
}

function calcConfidence(template) {
	var z = 1.96;
	var p = template.hits / template.tries;
	var n = template.tries;

	var cf = z * Math.sqrt((p * (1-p))/n);

	template.confidence = Math.floor(cf * 100);

	return template;
}

function calcConfidences(stats, cb) {
	cb(null, _.map(stats, calcConfidence));
}

exports.overview = function(req, res) {
	async.parallel([
		function(cb) {
			getStats(function(err, results) {
				calcConfidences(results, cb);
			});
		},
		getTotal
	], function(err, results) {
		console.log(results);
		res.render('stats', {
			templates: results[0],
			total: results[1]
		});
	});
};