var mongoose = require('mongoose')

var templateSchema = new mongoose.Schema({
   slug        : {type: String, unique: true},
   condition   : {type: String, default: 'true'},
   body        : String
});

templateSchema.methods.apply = function( variables ) {
   // first check condition
   if( eval( this.condition ) )
   {
      return this.body;
   }
   else
   {
      return false;
   }
   
}

module.exports = mongoose.model("Template", templateSchema);