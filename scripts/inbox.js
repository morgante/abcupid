var api = require('../okc/api')
var _    = require('underscore')
   async = require('async')

var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser'),
      Profile   = require('../models/profile')
      Message   = require('../models/message')

OkCupidUser.find({username: 'kameronsmith'}, function( err, users ) {

   async.each( users, function( usr, cb ) {
      
      Message.find({}).or([
         {'from': usr.username},
         {'to': usr.username}
      ]).sort({timestamp: -1}).limit(1).exec( function( err, msgs ) {
         lastMsg = msgs[0];
                  
         var client = api.createClient();

         client.authenticate( usr.username, usr.password, function( success ) {

            client.getInbox(
               {
                  after: lastMsg.timestamp
               }, function( messages ) {
                  _.each( messages, function( msg ) {
                     msg.message_id = msg.id.replace('message_', '');
                     Message.create(msg, function( err, msg) {

                     });
                  });
               
                  console.log( 'doneish' );
            });
            
         });
      });      
   }, function( err ) {
      process.exit();
   });

});