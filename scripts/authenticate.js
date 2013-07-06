var db = require('../helpers/connect')

var OkCupidUser = require('../models/okcupiduser')

var username = process.argv[2];
var password = process.argv[3];

console.log( username, password );

// console.log( process.argv );

OkCupidUser.create({
   username: username,
   password: password,
}, function( err, usr ) {
   console.log( usr );
   process.exit();
});

// process.exit();