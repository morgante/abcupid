var api = require('../okc/api')
var client = api.createClient()

var _    = require('underscore')
   async = require('async')

var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser'),
      Profile   = require('../models/profile');

OkCupidUser.find({}, function( err, users ) {

   async.each( users, function( usr, cb ) {

      client.authenticate( usr.username, usr.password, function( success ) {

         client.getProfile( usr.username, function( profile ) {
            Profile.create( {
               username: usr.username,
               essays: profile.essays
            }, function( err, prof ) {
               cb( err );
            });

            // process.exit();

         })

         // console.log( client );

      });

   }, function( err ) {
      process.exit();
   });

});