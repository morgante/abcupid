var api = require('../okc/api')
var messenger = require('../okc/messenger');
var messenger2 = require('../okc/messenger2');

var _    = require('underscore')
   async = require('async')

var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser'),
      Profile   = require('../models/profile')
      Message   = require('../models/message')

var User = require('../models/okcupiduser')

exports.request = function( req, res, next ) {
    res.render('batch-request', {
        count: 5,
        searchUrl: req.user.match_url,
        templates: req.user._templates,
        message: req.session.messages
    });
};

exports.batch2 = function(req, res, next) {
  user = req.user;
  user.match_url = req.body.searchUrl;
  user._templates = req.body.templates;

  // save preferences
  user.save( function( err, user ) {

  });

  var automatorOptions = {
    matchOptions: {
        seachUrl: user.match_url
    },
    messageOptions: {
        dryRun: false
    },
    maxMessages: req.body.count,
    delay: 1000
  };

  user.getTemplates( function( err, templates ) {

    var client = api.createClient();

    client.authenticate( user.username, user.password, function( success ) {        
        messenger2.messageMany(client, templates, automatorOptions);
        
        req.session.messages =  ["Sent batch request to message users."];
        return res.redirect('/batch');
    });
  });
};

exports.batch = function( req, res, next ) {

    user = req.user;
    user.match_url = req.body.searchUrl;
    user._templates = req.body.templates;

    // save preferences
    user.save( function( err, user ) {

    });

    var automatorOptions = {
        matchOptions: {
            seachUrl: user.match_url
        },
        messageOptions: {
            dryRun: false
        },
        maxMessages: req.body.count,
        delay: 1000
    };

    user.getTemplates( function( err, templates ) {

        var client = api.createClient()

        client.authenticate( user.username, user.password, function( success ) {            
            messenger.messageMany(client, templates, automatorOptions, function( messaged ){
                console.log('Messaged ' + messaged.length + ' people.')
            });
            
            req.session.messages =  ["Sent batch request to message users."];
            return res.redirect('/batch');
        });
    });
}

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