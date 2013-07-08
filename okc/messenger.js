var _ = require('underscore')

var Message   = require('../models/message')

messenger = {};

messenger.message = function(client, templates, target, opt, callback) {
   if (opt == null) opt = {}
   _.defaults(opt, {
      dryRun: true,
      recontact: false,
      save: true
   });
   
   client.getProfile( target, function( profile ) {
      if( !opt.recontact && profile.lastContacted != null )
      {
         console.log( 'Not contacting ' + target + ' because recontact is not enabled.' );
         callback( 'recontact', null );
      }
      else
      {
         message = false;
                  
         // copy to new templates
         templates = _.clone( templates );
         
         // reverse array order
         templates = templates.reverse();
                  
         while( message == false && templates.length > 0 ) {
            template = templates.pop();
            
            message = template.apply();
               
         }
               
                    
         if( message )
         {
            if (opt.dryRun)
   			{
   				console.log('Skipped sending message (dryRun option is currently enabled.) Message to ' + target + ' would have been: ' + message );
   				callback( 'dryrun', message );
   			}
   			else
   			{
   			   client.message(target, message, function() {
   					console.log('Message sent to ' + target + ': ' + message);
   					
   					if( opt.save ) {
      				   Message.log({
                        from: client.username,
                        to: target,
                        body: message,
                        template: template.slug
                     });
      				}
   					
   					callback( null, message );
   				})
   			}
         }
         
      }
      
   });
}

messenger.messageMany = function(client, templates, opt, callback) {
   if (opt == null) opt = {}
   _.defaults(opt, {
      maxMessages: 25,
      delay: 30000,
      matchOptions: {},
      messageOptions: {}
   });
   
   _.defaults(opt.matchOptions, {
      count: 25,
		searchUrl: '/match'
	});
	
	var i = 0;
	var matches = {
	   messaged: [],
	   unmessaged: []
	}
	
	// first search for matches
	client.matchSearch(opt.matchOptions, function(newMatches)
	{	   
	   matches.unmessaged = _.union( matches.unmessaged, newMatches );
	   
	   var doMessage = function() {
	      target = matches.unmessaged.pop();

   	   messenger.message( client, templates, matches.unmessaged.pop(), opt.messageOptions, function( err, message ) {
   	      matches.messaged.push( target );
   	   } );
   	   
   	   console.log( 'waiting ' + opt.delay / 1000 + ' seconds until sending next message...')
   	   setTimeout( doMessage, opt.delay );
	   }
	   
	   doMessage();
      	   
      // console.log( m)
      // var target = matches.leng
	   
      // currentMatches = matches;
      // messageMatch(function() { messageMatchCallback(callback) });
	});
}

module.exports = messenger;