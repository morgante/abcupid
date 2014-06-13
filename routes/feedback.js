var _ = require('underscore');
var forms = require('forms');

var Feedback = require('../models/feedback');

var questions = forms.create({
	best: forms.fields.string({ required: true, label: 'What were your date\'s best qualities?', widget: forms.widgets.textarea()}),
	worst: forms.fields.string({ required: true, label: 'What was annoying or distasteful about your date?', widget: forms.widgets.textarea()}),
	improve: forms.fields.string({ required: true, label: 'How could the date have been improved?', widget: forms.widgets.textarea()}),
	again: forms.fields.string({
		label: 'Would you go on another date?',
		choices: {yes: 'Yes', no: 'No'},
		widget: forms.widgets.multipleRadio(),
		fieldsetClasses: 'choice'
    })
});

function getState(from, to) {
	var state;

	if (from.answers === undefined && to.answers === undefined) {
		state = 0;
	} else if (from.answers === undefined && to.answers !== undefined) {
		state = 1;
	} else if (from.answers !== undefined && to.answers === undefined) {
		state = 2;
	} else {
		state = 3;
	}

	console.log('state', state);

	return state;
}

function fill(req, res, next, form) {
	var id = req.params.id;
	var fromId = req.params.from;

	Feedback.findById(id, function(err, feedback) {
		function checker(response) {
			// console.log(response);
			return response._id == fromId;
		}

		var from = _.find(feedback.responses, checker);
		var to = _.first(_.reject(feedback.responses, checker));
		var state = getState(from, to);

		if (state < 3) {
			res.render('feedback-give', { title: 'Express', from: from, to: to, state: state, form: form });
		} else {
			show(req, res, next);
		}
	});
}

function show(req, res, next) {
	var id = req.params.id;
	var fromId = req.params.from;

	Feedback.findById(id, function(err, feedback) {
		function checker(response) {
			// console.log(response);
			return response._id == fromId;
		}

		var from = _.find(feedback.responses, checker);
		var to = _.first(_.reject(feedback.responses, checker));

		var fromForm = questions.bind(from.answers);
		var toForm = questions.bind(to.answers);

		function renderer(name, data) {
			var q = data.label;
			var a = data.data;

			return '<div class="qa"><h4>' + q + '</h4><p>' + a + '</p></div>';
		}

		res.render('feedback-show', { title: 'Express', answers: {
			from: fromForm.toHTML(renderer),
			to: toForm.toHTML(renderer)
		} });
	});
}

module.exports = {
	start: function(req, res, next) {
		res.render('feedback-start', { title: 'Express' });
	},
	create: function(req, res, next) {
		var data = req.body;

		Feedback.create({
			responses: [
				{
					from: {
						name: data.youName,
						email: data.youEmail
					}
				},
				{
					from: {
						name: data.theirName,
						email: data.theirEmail
					}
				}
			]
		}, function(err, feedback) {
			var me = feedback.responses[0];
			
			res.redirect('/feedback/' + feedback._id + '/from/' + me._id);
		});
	},
	give: function(req, res, next) {
		questions.handle(req, {
			success: function (form) {
				// there is a request and the form is valid
				// form.data contains the submitted data
				var id = req.params.id;
				var fromId = req.params.from;

				Feedback.findById(id, function(err, feedback) {
					function checker(response) {
						// console.log(response);
						return response._id == fromId;
					}

					var from = _.find(feedback.responses, checker);
					var to = _.first(_.reject(feedback.responses, checker));
					from.answers = form.data;

					var state = getState(from, to);

					console.log(state);

					feedback.save(function(err) {
						if (err) {
							res.send(err);
						} else {
							if (state < 3) {
								res.render('feedback-share', {to: to, url: '/feedback/' + feedback._id + '/from/' + to._id});
							} else {
								show(req, res, next);
							}
						}
					});
				});
			},
			error: function (form) {
				// the data in the request didn't validate,
				// calling form.toHTML() again will render the error messages
				fill(req, res, next, form.toHTML());
			},
			empty: function (form) {
				// there was no form data in the request
				fill(req, res, next, form.toHTML());
			}
		});
	},
	fill: function(req, res, next) {

		fill(req, res, next, questions.toHTML());
	}
};