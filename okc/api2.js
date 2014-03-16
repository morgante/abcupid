var request = require('request');

exports.createClient = function(username, password, callback) {
	var uri = 'https://www.okcupid.com';

	var path = '/login';

	request.post(uri + path, {
		form: {username: username, password: password}
	}, function(err, response) {
		if (err) {
			callback(err, null);
		} else {
			console.log(response.headers );
		}
	});
};