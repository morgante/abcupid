var passport = require('passport');

var User = require('../models/okcupiduser')

// app.get('/', function(req, res){
//   res.render('index', { user: req.user });
// });
// 
// app.get('/account', ensureAuthenticated, function(req, res){
//   res.render('account', { user: req.user });
// });
// 
// app.get('/login', function(req, res){
//   res.render('login', { user: req.user, message: req.session.messages });
// });

exports.login = function( req, res, next ) {
    res.render('login', { user: req.user, message: req.session.messages });
}

exports.execLogin = function(req, res, next ){
    // try to create a new user off the bat (this will fail if user already exists)
    User.create({
       username: req.body.username,
       password: req.body.password,
    }, function( err, usr ) {
        // now auth on the new or existing user
        passport.authenticate('local', function(err, user, info) {        
            if (err) { return next(err) }
            if (!user) {
                req.session.messages =  [info.message];
                return res.redirect('/login')
            }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                return res.redirect('/');
            });
        })(req, res, next);
    });    
};

exports.logout = function( req, res ) {
    req.logout();
    res.redirect('/');
}


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