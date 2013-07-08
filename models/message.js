var mongoose = require('mongoose')
	, Schema = mongoose.Schema
	, ObjectId = Schema.ObjectId;

var messageSchema = new Schema({
	from:       String,
   to:         String,
   timestamp:  {type: Date, default: Date.now},
   message_id: {type: Number, unique: true, sparse: true},
   body:       String,
   template:   String
});

messageSchema.statics.log = function (properties, cb) {
   
   var Message = this;
   
   // properties to compare on
   search = {
      from: properties.from,
      to: properties.to,
      body: properties.body
      // maybe we should also check on timestamp in case of repetitive converssations?
   }
      
   // ensure we don't log the same message twice
   this.findOne( search, function( err, msg ) {
      if( msg == null ) {
         // console.log( Message );
         // doesn't exist, so create a new one
         Message.create( properties, function( err, msg ) {
            // console.log( err );
            if( cb != undefined )
            {
               cb( err, msg );
            }
         })
      }
      else
      {
         // save updated properties
         msg.set( properties );
         msg.save( function( err, msg ) {
            if( cb != undefined )
            {
               cb( err, msg );
            }
         })
      }
   })
}

module.exports = mongoose.model("Message", messageSchema);