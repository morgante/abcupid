var _ = require('underscore');

var templates = {
	'sup': 'sup babe',
	'what-new': 'What\'s new?',
	'going': 'Hey there, how\'s it going?',
	'pretty-cool': 'Your profile is pretty cool... but are you? What is the coolest thing you\'ve done lately?',
	'quick-question': 'Quick question - what do you expect out of OKCupid matches?',
	'taste': 'Wow, you have incredible taste. I wish I were as cool as you... maybe you can teach me?',
	'standard-hello': 'Hello, how are you?',
	'normally': 'I don\'t normally message people on this site, but when I do it\'s you. What\'s up?',
	'drinks': 'Drinks?',
	'guys': {
		body: 'Meeting any cool guys on here?',
		active: false
	},
	'longer': 'Hey, I\'m Jim! I\'m the CTO of a media company, but I really love hiking and travel. I feel like we\'d get along well together, we should be awesome in proximity and do something fun like ride bears and fly kites. I would settle for coffee though, just in case that\'s too intense.',
	'qualities': 'Besides your obvious looks and charm, what are your three best qualities?'
};

module.exports = {
	lookup: function(name, opts) {
		opts = _.defaults(opts, {
			active: true // only fetch active templates
		});

		template = templates[name];

		if (typeof template === 'string') {
			return template;
		} else {
			if (opts.active && !template.active) {
				return this.lookup(name, active);
			} else {
				return template.body;
			}
		}
	},
	list: templates,
	pick: function() {
		return _.sample(_.keys(templates));
	}
};