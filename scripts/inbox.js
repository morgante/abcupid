var api = require('../okc/api2');

var inbox = require('../okc/inbox');

var Message = require('../models/message');

var db = require('../helpers/connect');

function backup() {
   var args = process.argv.slice(2);

   if (args.length < 2) {
      console.log('Usage: node scripts/inbox.js username password');
      return;
   }

   var username = args[0];
   var password = args[1];

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
}

backup();