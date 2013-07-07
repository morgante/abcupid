var User = require('../models/okcupiduser')

exports.list = function(req, res){
   
   User.find({}, function( err, users ) {
      res.render('users', {users: users} );
   })
};

exports.edit = function(req, res){

   User.findOne( {username: req.params.username}, function( err, user ) {
      res.render('edit-user', { user: user} );
   });
   
};

// exports.create = function(req, res){
//    res.render('new-template', {} );
// };

exports.save = function(req, res){
   
   // console.log( req.body );
   
   username = req.params.username;
   
   console.log( req.body );
   
   User.update({username: username}, {
      active: req.body.active,
      match_url: req.body.match_url,
      _templates: req.body._templates
   }, {upsert: true}, function(err, user) {
      res.redirect( '/users/' + username );
   });
   
   // res.render('new-template', {} );
};