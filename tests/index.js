var api = require('../okc/api');
var okc = require('../okc/messenger2');

exports.messageMany = function() {
	var username = process.env.TEST_USERNAME;
	var password = process.env.TEST_PASSWORD;

	var client = api.createClient();

	var options = {
	};

	console.log('testing message many');

	console.log(username, password);

	client.authenticate( username, password, function( success ) {
		var matches = new okc.MatchStream({a: 'joe'});

		matches.on('data', function(data) {
			console.log(data);
		});

		messenger.messageMany(client, [], options);
    });
};