var Template = require('../models/template')

exports.manage = function(req, res){
   
   Template.find({}, function( err, templates ) {
      res.render('templates', {tpls: templates} );
   })
};

exports.create = function(req, res){
   res.render('new-template', {} );
};

exports.save = function(req, res){
   
   // console.log( req.body );
   
   params = {}
      
   Template.update({slug: req.params.slug}, {
      slug: req.body.slug,
      body: req.body.body,
      condition: req.body.condition
   }, {upsert: true}, function(err, template) {
      res.redirect( '/templates/' + req.body.slug );
   });
   
   // res.render('new-template', {} );
};

exports.view = function(req, res){

   Template.findOne( {slug: req.params.slug}, function( err, template ) {
      res.render('view-template', { tpl: template} );
   });
   
   // res.render('new-template', {} );
};