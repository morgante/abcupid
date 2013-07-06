var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var profileSchema = new Schema({
	username	      : {type: String},
	date           : {type: Date, default: Date.now},
	essays         : {type: Schema.Types.Mixed},
	status         : {type: String, default: 'active'},
	lastContacted  : {type: Date}
});


module.exports = mongoose.model("Profile", profileSchema);