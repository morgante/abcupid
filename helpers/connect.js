var mongoose = require('mongoose');
		
var pkg = require('../package.json');

var name = 'abcupid_test';

// set up Mongoose
mongoose.connect(process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/' + name);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
   console.log('Connected to DB: ' + pkg.name);
   return;
});

module.exports = db;