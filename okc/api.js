var rest = require('restler')
var request = require('request')
var select = require('soupselect').select
var _ = require('underscore')
var htmlparser = require('htmlparser')
var querystring = require('querystring')
var async = require('async')

var uri = 'http://www.okcupid.com'
var user_agent = 'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_6; en-US) AppleWebKit/534.16 (KHTML, like Gecko) Chrome/10.0.648.134 Safari/534.16'
var authcodeRegex = /Profile.initialize\(user_info, .+, '(\d,\d,\d+,[^']+)'/

exports.createClient = function() {
	var _sessionCookie = null
	var _authcode = null
	var _username = null
	var _userId = null
	
	var post = function(path, params, callback) {	
	   
	   request( {
	      url: uri + path,
	      method: 'POST',
	      form: params,
	      followRedirects:false,
	      headers: {"User-Agent": user_agent, "Cookie": _sessionCookie}
	   }, function( err, response, body ) {
	      if (response.headers['set-cookie'] != null)
			{
				// console.log(response.headers['set-cookie'])
				var cookies = response.headers['set-cookie'].forEach(function(s)
				{
					if (s.indexOf('session=') > -1)
					{
						_sessionCookie = s.split(';')[0]									
					}
				})		
			}
			
			callback(body, response)
	   });
	}
	
	var get = function(path, callback)
	{
	   request( {
	      url: uri + path,
	      method: 'GET',
	      followRedirects:false,
	      headers: {"User-Agent": user_agent, "Cookie": _sessionCookie}
	   }, function( err, response, body ) {
			callback(body, response)
	   });
	}
	
	var parseProfile = function(html, callback)
	{
		var profile = {}
		var handler = new htmlparser.DefaultHandler(function(err, dom) {
			if (err) {
                sys.debug("Error: " + err);
			} else {
			   username = select(dom, 'span#basic_info_sn');
			   			   			   			   
			   if( username.length > 0 && username[0].children != undefined )
			   {
			      profile.username = username[0].children[0].data
   				var lastContacted = select(dom, 'div#contacted p')
   				if (lastContacted.length > 0)
   				{
   					profile.lastContacted = lastContacted[0].children[0].data				
   				}
   				else
   				{
   					profile.lastContacted = null
   				}

   				profile.essays = {};

   				// essays
   				for (var i=0;i<10;i++)
               { 

                  txt = '';
                  esy = select( dom, 'div#essay_text_' + i);

                  if( esy.length > 0 ) 
                  {
                     _.each( esy[0].children, function( child ) {
                       if( child.type == 'text' )
                       {
                          txt += child.raw;
                       }
                     } );

                     profile.essays[ 'essay_' + i] = txt.trim();
                  }

               }
			   }
			   else
			   {
               // console.log( dom );
   			   
			      profile.status = 'deactive'
			   }
			   
					
         }
			callback(profile)
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(html);
					
	}
	
	var parseSearchResults = function(html, callback)
	{
		var results = []
		var handler = new htmlparser.DefaultHandler(function(err, dom) {
			if (err) {
                sys.debug("Error: " + err);
			} else {
				var matches = select(dom, 'div.match_row span.username')
				matches.forEach(function(match)
				{
					results.push(match.children[0].data)
				})
            }
			callback(results)
        });

        var parser = new htmlparser.Parser(handler);
        parser.parseComplete(html);
	}
	
	var client = {	
	   		
		authenticate: function(username, password, callback)
		{
		   this.username = username;
			
			if (_sessionCookie != null)
			{
				console.log("Already logged in.")
			}
			post('/login', {username: username, password: password}, function(data, response)
			{				
				if (_sessionCookie != null)
				{
					console.log("Succesfully authenticated. Fetching authcode to send messages.")
					_username = username;
					// Getting authcode.
					get('/profile/' + username, function(data, response)
					{
						var match = authcodeRegex.exec(data);						
						_authcode = match != null ? match[1] : null
						if (_authcode != null && callback) 
						{
							console.log('Authcode found. You are ready to send messages.')
							callback(true)
						}
						else 
						{
							console.log('Couldn\'t parse out an authcode from your profile. Okcupid has probably changed their source. Update the regex for finding the code.')
							callback(false)
						}
					})					
					
				}
				else
				{
					console.log("Login failure. Check username / password.")
					if (callback != null) callback(false)
				}
			})
		},
	
		message: function(username, message, callback)
		{			
			var params = {
				sendmsg: '1',
				r1: username,
				body: message,
				authcode: _authcode,	
				from_profile: '1',
				ajax: '1',
			}
			post('/mailbox', params, function(data, response)			
			{
            // console.log('Message to ' + username + ' sent!')
				//console.log(data)
				if (callback != null) callback()
			})			
		},
		
		getProfile: function(username, callback)
		{			
			get('/profile/' + username, function(data, response)
			{
				parseProfile(data, callback)
			})
		},
		
		matchSearch: function(opt, callback) 
		{
			// opt will include search options, but for now only includes searchUrl pasted from the site...
			if (opt == null) opt = {}
			_.defaults(opt, {
				low: 1,
				count: 25,
				searchUrl: '/match'				
			})
			
			var url = opt.searchUrl.replace('http://', '').replace('www.okcupid.com', '').replace('okcupid.com', '')
				.replace(/[&\?]?low=\d+/, '')
				.replace(/[&\?]?count=\d+/, '')
					
			// There's def a cleaner way to do this next bit.
			if (url != '/match')
			{
				url = url + '&low=' + opt.low + '&count=' + opt.count
			}
			else
			{
				url = url + '?low=' + opt.low + '&count=' + opt.count
			}
			
         // console.log( url );
			
			get(url, function(data, response) {
            // console.log( data );
			   
				parseSearchResults(data, callback)
			})
		},
		
		getInbox: function( opt, callback )
		{
		   
		   if( opt.url == null )
		   {
		      opt.url = '/messages'
		   }
		   
		   get(opt.url, function( data, response ) {
		      
      		var handler = new htmlparser.DefaultHandler(function(err, dom) {
      			if (err) {
                      sys.debug("Error: " + err);
      			} else {
      			   
      			   var threads = select( dom, '#messages li');
      			   
                  // console.log( threads );
      			   
                  // messages = messages;
                  // console.log( messages );
                  
                  all_messages = [];
      			   
      			   async.each( threads, function( msg, cb ) {
      			      var url = select( msg, 'a.open' )[0].attribs.href.replace('&amp;','&');
      			      var ts = select( msg, '.timestamp script');
                     ts = new Date( ts[0].children[0].raw.match(/, (\d+), /)[1] * 1000 );
      			      
      			      var with_who = select( msg, '.subject' )[0].children[0].data;
      			            			      
      			      if( ts > opt.after )
      			      {
      			         get(url, function( data, response ) {

         			         var handler = new htmlparser.DefaultHandler(function(err, dom) {
                     			if (err) {
                                     sys.debug("Error: " + err);
                     			} else {

                                 console.log( 'loaded: ' + url );

                     			   messages = [];

                     			   _.each( select( dom, '#thread li'), function( msg ) {

                     			      var ts = select( msg, '.timestamp script');
                     			      var body = select( msg, '.message_body');

                     			      if( body.length > 0 )
                     			      {
                                       ts = new Date( ts[0].children[0].raw.match(/, (\d+), /)[1] * 1000 );
                     			         var prof = select( msg, 'a.photo')[0].attribs['title'];
                     			         var id = msg.attribs.id;

                     			         var txt = '';

                     			         _.each( body[0].children, function( bpart ) {
                     			            if( bpart.type == 'text' )
                     			            {
                     			               txt += bpart.raw.trim() + ' ';
                     			            }
                     			         });

                     			         if( prof == _username ) // sent by me
                     			         {
                     			            var from = _username
                     			            var to = with_who
                     			         }
                     			         else // sent by them
                     			         {
                     			            var from = with_who
                     			            var to = _username
                     			         }

                     			         messages.push({
                     			            from: from,
                     			            to: to,
                     			            timestamp: ts,
                     			            id: id,
                     			            body: txt
                     			         });
                     			      }
                     			   });

                                 all_messages = _.union( all_messages, messages );
                                 // console.log( all_messages );
                                 
                                 // console.log( messages );

                                 cb( null );

                                 // console.log( messages.length );

                              }
                           });

                           var parser = new htmlparser.Parser(handler);
                           parser.parseComplete(data);
         			      });
      			      }
      			      else
      			      {
      			         cb( null );
      			      }
      			      
      			   }, function( err ) {
      			      callback( all_messages )
      			   });
      			      					   
      			   
               }
            });
            
            var parser = new htmlparser.Parser(handler);
            parser.parseComplete(data);
		   });
		}
			
	}
	return client;
}
