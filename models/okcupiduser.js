var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var crypto = require('crypto');


var okCupidUserSchema = new Schema({
	username	   : {type: String, unique: true},
	_password   : String,
	date        : {type: Date, default: Date.now}
});

okCupidUserSchema.virtual('password').set(function (password) {
   var cipher = crypto.createCipher('aes-256-cbc', process.env.SECRET);
   var crypted = cipher.update( password ,'utf8','hex')
   crypted += cipher.final('hex');
   this._password = crypted;
});

okCupidUserSchema.virtual('password').get(function () {
   var decipher = crypto.createDecipher('aes-256-cbc', process.env.SECRET)
   var dec = decipher.update(this._password,'hex','utf8')
   dec += decipher.final('utf8')
   return dec;
});

module.exports = mongoose.model("OkCupidUser", okCupidUserSchema);