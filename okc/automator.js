var _ = require('underscore')
var async = require('async')

exports.timeBetweenRequests = 30000
exports.maxMessages = 100

exports.messageMatches = function(client, message, opt, callback)
{
	if (opt == null) opt = {}
	_.defaults(opt, {
		maxMessages: exports.maxMessages,
		timeBetweenRequests: exports.timeBetweenRequests,
		dryRun: false,
		matchOptions: {
		}
	})
	
	_.defaults(opt.matchOptions, {
		count: 25,
		searchUrl: '/match'
	})
	
	var messagedMatches = 0
	var currentMatchIndex = 1
	var currentMatches = []	
	
	console.log('Automator: Finding ' + opt.maxMessages + ' matches to message.');
	
	var messageMatch = function(callback)
	{
		
		var nextMatch = currentMatches.pop()
		console.log('Getting profile for: ' + nextMatch)
		
		client.getProfile(nextMatch, function(profile)
		{
		   
		   if( _.isFunction( message ) ) {
		      txt = message( profile );
		   }
		   else
		   {
		      txt = message;
		   }
		   
			if (profile.lastContacted != null)
			{
				console.log('This user has already been messaged.')
				callback()
			}
			else if (opt.dryRun)
			{
				console.log('Skipped sending message (dryRun option is currently enabled.) Message would have been: ' + txt )
				messagedMatches += 1
				callback()
			}
			else
			{
			   			   
				client.message(nextMatch, txt, function() {
					messagedMatches += 1
					console.log('Message sent.')
					callback()
				})
			}				
		})							
	}	

	var messageMatchCallback = function(callback)
	{
		if (messagedMatches >= opt.maxMessages || currentMatches.length == 0)
		{
			console.log('This batch of matches is complete.')
			callback()
		}
		else
		{
			console.log('Messaging next match in ' + opt.timeBetweenRequests/1000 + 's.')
			// Wow this is ugly. Has to be a better way to do this.
			setTimeout(function() { messageMatch(function() { messageMatchCallback(callback) }) }, opt.timeBetweenRequests)
		}
	}
	
	var search = function(callback)
	{
		console.log('Searching for ' + opt.matchOptions.count + ' matches.')
		client.matchSearch(opt.matchOptions, function(matches)
		{
		   console.log( matches );
		   
			currentMatches = matches			
			messageMatch(function() { messageMatchCallback(callback) })			
		})	
	}
	
	var searchCallback = function()
	{
		
		if (messagedMatches >= opt.maxMessages)
		{			
			console.log('Automator: Completed sending ' + messagedMatches + ' messages.')
			callback()
		}
		else
		{
			console.log('Getting more matches in ' + opt.timeBetweenRequests/1000 + 's.')
			setTimeout(function() { search(searchCallback) }, opt.timeBetweenRequests)
		}
	}
	
	search(searchCallback)
}

