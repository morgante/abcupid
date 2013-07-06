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

// Copy your preferred match search's url from the website.
// var matchOptions = {
//    searchUrl: 'http://www.okcupid.com/match?filter1=0,34&filter2=2,23,29&filter3=3,25&filter4=5,31536000&filter5=1,1&filter6=35,2&filter7=9,256&filter8=30,468&filter9=25,8000,10000&locid=0&timekey=1&matchOrderBy=SPECIAL_BLEND&custom_search=0&fromWhoOnline=0&mygender=m&update_prefs=1&sort_type=0&sa=1&using_saved_search='
// }
// 
// var automatorOptions = {
//    matchOptions: matchOptions,
//    dryRun: false,
//    maxMessages: 100,
//    timeBetweenRequests: 30000
// }
// 
// var message = 'How are you?'
// 
// client.authenticate('user', 'pass', function(success){   
//    automator.messageMatches(client, message, automatorOptions, function(){
//       console.log('Complete!')
//    })
// })