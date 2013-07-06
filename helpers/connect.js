var mongoose = require('mongoose')
		
var pkg = require('../package.json')

// set up Mongoose
mongoose.connect('localhost', pkg.name);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
   console.log('Connected to DB: ' + pkg.name);
   return;
});

module.exports = db;