var api = require('../okc/api');
var messenger = require('../okc/messenger2');

exports.messageMany = function() {
	var username = process.env.TEST_USERNAME;
	var password = process.env.TEST_PASSWORD;

	var client = api.createClient();

	var options = {

	};

	console.log('testing message many');

	client.authenticate( username, password, function( success ) {
		messenger.messageMany(client, [], options);
    });
};