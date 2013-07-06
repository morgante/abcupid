var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
	from:       String,
   to:         String,
   timestamp:  Date,
   message_id: {type: Number, unique: true},
   body:       String
});

module.exports = mongoose.model("Message", messageSchema);