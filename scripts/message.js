var api = require('../okc/api')
var messenger = require('../okc/messenger')
var client = api.createClient()

var _    = require('underscore')
async = require('async')

var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser'),
Profile   = require('../models/profile');

OkCupidUser.find({ active: true }, function( err, users ) {

   async.each( users, function( user, cb ) {

      var automatorOptions = {
         matchOptions: {
            seachUrl: user.match_url
         },
         messageOptions: {
            dryRun: true
         },
         maxMessages: 5,
         delay: 10000
      }

      user.getTemplates( function( err, templates ) {
         client.authenticate( user.username, user.password, function( success ) {
            messenger.messageMany(client, templates, automatorOptions, function(){
               console.log('Complete!')
            })
         });
      });

   });

});