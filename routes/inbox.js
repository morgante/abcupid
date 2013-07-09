var api = require('../okc/api')
var _    = require('underscore')
   async = require('async')

var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser'),
      Profile   = require('../models/profile')
      Message   = require('../models/message')

var User = require('../models/okcupiduser')

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
                  });
               }
            })
         }
         
      });
   });

   console.log( 'doneish with inbox' );
}

exports.download = function( user ) {
    after = new Date('january 1, 1970');

    var client = api.createClient();

    client.authenticate( user.username, user.password, function( success ) {
        
        // get main inbox
        client.getInbox(
            {
                after: after
            },
            function( messages ){
                storeMessages( messages, client );
            }
        );
        
        // get sent messages
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
}

exports.inbox = function( req, res, next ) {
    
    user = req.user;
    
    exports.download( user );
    
    Message.find({}).or([
        {'to': user.username},
        {'from': user.username}
    ]).sort({timestamp: -1}).exec( function( err, messages ) {
       res.render('inbox', { user: req.user, messages: messages }); 
    });
    
    // res.render('login', { user: req.user, message: req.session.messages });
}