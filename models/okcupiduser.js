var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var crypto = require('crypto')
   _ = require('underscore')

var Template = require('./template');


var okCupidUserSchema = new Schema({
	username	   : {type: String, unique: true},
	_password   : String,
	date        : {type: Date, default: Date.now},
	active      : {type: Boolean, default: false},
	match_url   : {type: String, default: 'http://www.okcupid.com/match'},
	_templates  : {type: String, default: ''}
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


okCupidUserSchema.methods.getTemplates = function (cb) {
   slugs = this._templates.split(',');
   
   // remove whitespace
   slugs = _.map( slugs, function( tpl ) { return tpl.trim(); } );
      
   Template.find({ "slug": {"$in": slugs }}, function( err, templates ) {
      // keep consistent ordering
      templates = _.sortBy( templates, function( template ) {
         return slugs.indexOf( template.slug );
      });
      
      cb( err, templates );
   });

   
}

module.exports = mongoose.model("OkCupidUser", okCupidUserSchema);