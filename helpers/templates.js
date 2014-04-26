var _ = require('underscore');

var templates = {
	'sup': 'sup babe',
	'what-new': 'What\'s new?',
	'going': 'Hey there, how\'s it going?',
	'pretty-cool': 'Your profile is pretty cool... but are you? What is the coolest thing you\'ve done lately?',
	'quick-question': 'Quick question - what do you expect out of OKCupid matches?',
	'taste': 'Wow, you have incredible taste. I wish I were as cool as you... maybe you can teach me?',
	'standard-hello': 'Hello, how are you?'
};

module.exports = {
	lookup: function(name) {
		return templates[name];
	},
	list: templates,
	pick: function() {
		return _.sample(_.keys(templates));
	}
};