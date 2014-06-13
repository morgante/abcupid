var mongoose = require('mongoose');

var schema = new mongoose.Schema({
   timestamp: {type: Date, default: new Date()},
   responses: [
      {
         from: {
            name: String,
            email: String
         },
         answers: {}
      }
   ]
});


module.exports = mongoose.model("Feedback", schema);