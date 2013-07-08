var api = require('../okc/api')
var _    = require('underscore')
   async = require('async')

var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser'),
      Profile   = require('../models/profile')
      Message   = require('../models/message')
      
function storeMessages ( messages, client ) {
   _.each( messages, function( msg ) {
      msg.message_id = msg.id.replace('message_', '');
      Message.log(msg, function( err, msg) {
         
         if( !err ) {
            Profile.findOne( {username: msg.to}, function( err, prof ) {
               if( prof == null )
               {
                  client.getProfile( msg.to, function( profile ) {
                     profile.username = msg.to;
                     
                     Profile.create( profile, function( err, prof ) {
                        
                     });

                     // process.exit();

                  });
               }
            })
         }
         
         // Profile.count({ username: msg.to}, function( err, cnt ) {
         //             console.log( cnt );
         //          });
         
         // Profile.find( 'username')
         
      });
   });

   console.log( 'doneish with inbox' );
}

OkCupidUser.find({}, function( err, users ) {
   
   // console.log( users );

   async.each( users, function( usr, cb ) {
      
      Message.find({}).or([
         {'from': usr.username},
         {'to': usr.username}
      ]).sort({timestamp: -1}).limit(1).exec( function( err, msgs ) {
         lastMsg = msgs[0];
         
         if( msgs.length > 0 )
         {
            after = msgs[0].timestamp;
         }
         else
         {
            after = new Date('january 1, 1970');
         }
                           
         var client = api.createClient();

         client.authenticate( usr.username, usr.password, function( success ) {

            client.getInbox(
               {
                  after: after
               },
               function( messages ){
                  storeMessages( messages, client );
               }
            );
            
            client.getInbox(
               {
                  after: after,
                  url: '/messages?folder=2'
               },
               function( messages ){
                  storeMessages( messages, client );
               }
            );
            
         });
      });      
   }, function( err ) {
      process.exit();
   });
   
});