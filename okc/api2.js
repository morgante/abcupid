var request = require('request');
var _ = require('underscore');

var uri = 'https://www.okcupid.com';
var user_agent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.134 Safari/534.16';
var authcodeRegex = /"authcode" : "(\S+)"/;

exports.createClient = function() {
	var cookies = request.jar();
	var authcode;

	var fetch = function(opts, callback) {
		opts = _.defaults(opts, {
			url: uri + opts.path,
			followRedirects: true,
			headers: {"User-Agent": user_agent},
			jar: cookies,
			strictSSL: false
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
			}, function(err, body, res) {
				if (err) {
					console.log("Failed to authenticate to OKC");
					callback(false);
					return;
				} else {
					console.log("sucessfully authenticated to OKC");
				}

				get({path: '/profile/' + self.username}, function(err, data) {

					var match = authcodeRegex.exec(data);
					
					if (match !== null) {
						authcode = match[1];

						console.log('Authcode found.');
						console.log(authcode);
						callback(true);
					} else {
						console.log('error error! could not find authcode');
						callback(false);
						process.exit();
					}
				});
			});
		},
		message: function(username, message, callback) {
			var params = {
				sendmsg: '1',
				r1: username,
				body: message,
				subject: '',
				threadid: 0,
				"authcode": authcode,
				from_profile: '1',
				ajax: '1',
			};

			get({
				path: '/mailbox',
				qs: params
			}, function(err, data) {
				callback(err, data);
			});
		},
		get: get,
		post: post
	};

	return client;
};