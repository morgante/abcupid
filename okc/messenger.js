var _ = require('underscore')

messenger = {};

messenger.message = function(client, templates, target, opt, callback) {
   if (opt == null) opt = {}
   _.defaults(opt, {
      dryRun: true,
      recontact: false,
   });
   
   client.getProfile( target, function( profile ) {
      if( !opt.recontact && profile.lastContacted != null )
      {
         console.log( 'Not contacting ' + target + ' because recontact is not enabled.' );
      }
      else
      {
         message = false;
         
         // reverse array order
         templates = templates.reverse();
         
         while( message == false && templates.length > 0 ) {
            template = templates.pop();
            
            message = template.apply();
               
         }
         
         if( message )
         {
            
         }
         
         console.log( message );
      }
      
      callback( null );
   });
}

messenger.messageMany = function(client, templates, opt, callback) {
   if (opt == null) opt = {}
   _.defaults(opt, {
      maxMessages: 25,
      timeBetweenRequests: 30000,
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
	   	   
	   target = matches.unmessaged.pop();
	   
	   messenger.message( client, templates, matches.unmessaged.pop(), opt.messageOptions, function( err, message ) {
	      matches.messaged.push( target );
	   } );
      	   
      // console.log( m)
      // var target = matches.leng
	   
      // currentMatches = matches;
      // messageMatch(function() { messageMatchCallback(callback) });
	});
}

module.exports = messenger;