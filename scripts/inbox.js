var api = require('../okc/api2');

var inbox = require('../okc/inbox');

var Message = require('../models/message');


exports.backup = function() {
   var username = process.env.TEST_USERNAME;
   var password = process.env.TEST_PASSWORD;

   var client = api.createClient();

   client.authenticate( username, password, function( success ) {
      var messages = new inbox.MessageStream({
         client: client
      });

      var saving = Message.makeStream({
         owner: username
      });

      messages.pipe(saving);
    });
};