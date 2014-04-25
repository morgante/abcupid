var request = require('request');
var _ = require('underscore');

var uri = 'https://www.okcupid.com';
var user_agent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.134 Safari/534.16';
var authcodeRegex = /Profile.initialize\(.+ "authcode" : "(\S+)",/;

exports.createClient = function() {
	var cookies = request.jar();
	var authcode;

	var fetch = function(opts, callback) {
		opts = _.defaults(opts, {
			url: uri + opts.path,
			followRedirects: true,
			headers: {"User-Agent": user_agent},
			jar: cookies
		});

		// console.log(opts);

		request(opts, function( err, response, body ) {
			// console.log(err, body);
			callback(err, body, response);
		});
	};
	
	var post = function(opts, callback) {
		opts = _.defaults(opts, {
			method: 'POST',
			form: opts.data
		});

		delete opts.data;

		fetch(opts, callback);
	};

	var get = function(opts, callback) {
		opts = _.defaults(opts, {
			method: 'GET',
		});

		fetch(opts, callback);
	};

	var client = {
		authenticate: function(username, password, callback) {
			var self = this;
			this.username = username;

			post({
				path: '/login',
				data: {username: username, password: password}
			}, function(data, response) {
				console.log("sucessfully authenticated to OKC");

				get({path: '/profile/' + self.username}, function(err, data) {
					// console.log(err, data);

					var match = authcodeRegex.exec(data);

					if (match !== null) {
						authcode = match[1];

						console.log('Authcode found.');
						callback(true);
					} else {
						console.log('error error! could not find authcode');
						callback(false);
					}
				});
			});
		},
		get: get,
		post: post
	};

	return client;
};