var mongoose = require('mongoose')

var templateSchema = new mongoose.Schema({
   slug        : {type: String, unique: true},
   condition   : {type: String, default: 'true'},
   body        : String
});

module.exports = mongoose.model("Template", templateSchema);