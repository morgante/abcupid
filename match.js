var request = require("request"),
	jsdom = require("jsdom");

// Match.prototype.init = function()	{
	
	request({
		url: "http://www.match.com/login/logout.aspx?lid=1&ER=sessiontimeout",
		method: "post",
		body: "__VIEWSTATE=%2FwEPDwULLTIxMjE0MjQzODYPZBYCZg9kFgQCAQ9kFggCAg8WAh4EaHJlZgU%2BaHR0cDovL3d3dy5tYXRjaC5jb20vbG9naW4vbG9nb3V0LmFzcHg%2FbGlkPTEmRVI9c2Vzc2lvbnRpbWVvdXRkAgsPZBYCZg9kFgICAg8WAh4HVmlzaWJsZWhkAg0PFQEEdHJ1ZWQCEQ9kFgJmD2QWBAICDxYCHwFoZAIEDxYCHwFoZAIDDxYCHgVjbGFzcwUUIGZpcmVmb3ggdzNjQm94TW9kZWwWBmYPDxYCHwFoZBYCZg9kFgJmD2QWAgIBDxYCHwFoFgICAQ8WAh4EVGV4dGRkAgEPZBYGAgEPZBYCZg9kFgQCBA9kFggCAQ9kFgICAQ9kFgJmD2QWAgIBDw8WAh8BaGRkAgMPZBYQAgMPZBYEZg8VAQBkAgEPDxYCHgtOYXZpZ2F0ZVVybAUZfi9ob21lL215bWF0Y2guYXNweD9saWQ9MmQWAmYPFQEESG9tZWQCBA9kFgZmDxUDAAZTZWFyY2gAZAIBDw8WAh8EBRl%2BL3NlYXJjaC9pbmRleC5hc3B4P2xpZD0yZBYCZg8VAQZTZWFyY2hkAgMPFgIeC18hSXRlbUNvdW50AgUWCgIBD2QWAgIBDw8WAh8EBRl%2BL3NlYXJjaC9pbmRleC5hc3B4P2xpZD0yZBYCZg8VAglHbyBTZWFyY2gAZAICD2QWAgIBDw8WAh8EBRx%2BL3NlYXJjaC9zZWFyY2guYXNweD9saWQ9MTA4ZBYCZg8VAg1DdXN0b20gU2VhcmNoAGQCAw9kFgICAQ8PFgIfBAUifi9teW1hdGNoZXMvbXltYXRjaGVzLmFzcHg%2FbGlkPTEwOGQWAmYPFQIMTXV0dWFsIE1hdGNoAGQCBA9kFgICAQ8PFgIfBAUjfi9zZWFyY2gvcmV2ZXJzZVNlYXJjaC5hc3B4P2xpZD0xMDhkFgJmDxUCDVJldmVyc2UgTWF0Y2gAZAIFD2QWAgIBDw8WAh8EBR1%2BL3NlYXJjaC9kYXRlc3BhcmsuYXNweD9saWQ9MmQWAmYPFQIQRGF0ZVNwYXJrIFNlYXJjaABkAgUPZBYGZg8VAwAXTWF0Y2hlc0RhaWx5NVNpbmdsZWRPdXQAZAIBDw8WAh8EBRl%2BL2RhaWx5NS9pbmRleC5hc3B4P2xpZD0yZBYCZg8VAQdNYXRjaGVzZAIDDxYCHwUCARYCAgEPZBYCAgEPDxYCHwQFGX4vZGFpbHk1L2luZGV4LmFzcHg%2FbGlkPTNkFgJmDxUCDURhaWx5IE1hdGNoZXMAZAIGD2QWBmYPFQMAC0Nvbm5lY3Rpb25zAGQCAQ8PFgIfBAUxfi9jb25uZWN0L2Nvbm5lY3Rpb25zLmFzcHg%2FbGlkPTEmdmlldz1jb25uZWN0aW9uc2QWAmYPFQELQ29ubmVjdGlvbnNkAgMPFgIfBQIHFg4CAQ9kFgICAQ8PFgIfBAUxfi9jb25uZWN0L2Nvbm5lY3Rpb25zLmFzcHg%2FbGlkPTEmdmlldz1jb25uZWN0aW9uc2QWAmYPFQIPQWxsIENvbm5lY3Rpb25zAGQCAg9kFgICAQ8PFgIfBAUgfi9jb21tdW5pY2F0ZS93aW5rcy5hc3B4P2xpZD0zMTVkFgJmDxUCBVdpbmtzAGQCAw9kFgICAQ8PFgIfBAUZfi9waG90b3MvbXlsaWtlcy8%2FbGlkPTMxNWQWAmYPFQIFTGlrZXMAZAIED2QWAgIBDw8WAh8EBSV%2BL3NlYXJjaC9ub3RpY2VkbWVzZWFyY2guYXNweD9saWQ9MTA4ZBYCZg8VAhFXaG%2FigJlzIFZpZXdlZCBNZQBkAgUPZBYCAgEPDxYCHwQFI34vc2VhcmNoL2ZhdmVkbWVTZWFyY2guYXNweD9saWQ9NDcxZBYCZg8VAhRXaG%2FigJlzIEZhdm9yaXRlZCBNZQBkAgYPZBYCAgEPDxYCHwQFIn4vbWF0Y2hib29rL21hdGNoYm9vay5hc3B4P2xpZD0zMTVkFgJmDxUCDE15IEZhdm9yaXRlcwBkAgcPZBYCAgEPDxYCHwQFDX4vbWF0Y2hQaG9uZS9kFgJmDxUCCVBob25lYm9vawBkAgcPZBYGZg8VAwAITWVzc2FnZXMAZAIBDw8WAh8EBSp%2BL2RvdWJsZWJsaW5kL2NvbW11bmljYXRpb25zbG9nLmFzcHg%2FbGlkPTJkFgJmDxUBCE1lc3NhZ2VzZAIDDxYCHwUCARYCAgEPZBYCAgEPDxYCHwQFKn4vZG91YmxlYmxpbmQvY29tbXVuaWNhdGlvbnNsb2cuYXNweD9saWQ9MmQWAmYPFQIFRW1haWwAZAIID2QWBmYPFQMAB1Byb2ZpbGUAZAIBDw8WAh8EBRx%2BL3Byb2ZpbGUvcHJvZmlsZS5hc3B4P2xpZD0yZBYCZg8VAQdQcm9maWxlZAIDDxYCHwUCBRYKAgEPZBYCAgEPDxYCHwQFHH4vcHJvZmlsZS9wcm9maWxlLmFzcHg%2FbGlkPTJkFgJmDxUCCVZpZXcvRWRpdABkAgIPZBYCAgEPDxYCHwQFFH4vUGhvdG9zL0VkaXQvP2xpZD0yZBYCZg8VAgZQaG90b3MAZAIDD2QWAgIBDw8WAh8EBRB%2BL3F1aXp6ZXMvP2xpZD0yZBYCZg8VAgdRdWl6emVzAGQCBA9kFgICAQ8PFgIfBAUTfi9EYXRlcy9TaG93Lz9saWQ9MmQWAmYPFQIJRGF0ZVNwYXJrAGQCBQ9kFgICAQ8PFgIfBAUZfi9wcm9maWxlL3NldHRpbmdzLz9saWQ9MmQWAmYPFQIIU2V0dGluZ3MAZAIJD2QWBmYPFQMABUxvZ2luAGQCAQ8PFgIfBAUYfi9sb2dpbi9sb2dpbi5hc3B4P2xpZD0xZBYCZg8VAQdTaWduIEluZAIDDxYCHwUCARYCAgEPZBYCAgEPDxYCHwQFFn4vaGVscC9oZWxwLmFzcHg%2FbGlkPTJkFgJmDxUCBEhlbHAAZAILDxYCHwFoZAIEDxYCHwFoFgICAg8VAgpwaWVzcnRhc3R5CDEvMS8xOTAwZAIGD2QWDAIBDxYCHwFoFgICAQ9kFgJmDxYCHwMFCFdlbGNvbWUgZAICDxYCHwFoFhACAQ8WAh8BaBYCAgMPFgIfAwUBMGQCAw8WAh8BaBYCAgMPFgIfAwUBMGQCBQ8WAh8BaBYCAgMPFgIfAwUBMGQCBw8WAh8BaBYCAgMPFgIfAwUBMGQCCQ8WAh8BaBYCAgMPFgIfAwUBMGQCCw8WAh8BaBYEZg8VAg4vY2hhdC9wdHIuYXNweABkAgEPFgIfAwUBMGQCDQ9kFgICAQ8WAh8BaBYCAgMPFgIfAwUBMGQCDw8WAh8BaBYEAgEPZBYCZg8VAQBkAgMPFgIfAwUBMGQCBQ8WAh8BaGQCBw8WAh8ABT9odHRwOi8vbWF0Y2gucHJvbW8uZXByaXplLmNvbS9jdXBpZC8%2FYWZmaWxpYXRlX2lkPTczMDMyNyZlbWFpbD1kAg4PFgIfAWgWAgIBD2QWBgIBD2QWAgIBDw8WAh8EBR8vc3Vic2NyaWJlL3N1YnNjcmliZS5hc3B4P2xpZD0xZBYCZg8PFgIfAWhkZAIDDxYCHwFoFgQCAQ8WAh8BaGQCBQ8WAh8BaGQCBQ9kFgQCAw8WBB8AZB8BaGQCBQ8PFgIfAWhkZAIQDxYCHwFoZAIID2QWAgIBDw8WAh8BaGRkAgcPZBYCAgEPZBYCZg9kFgICBA9kFgJmD2QWAmYPZBYEAgsPZBYCZg9kFgICCA8VAQBkAg0PZBYCZg9kFgJmDxYCHwFoZAIJDw8WAh8BaGRkAgMPDxYCHwFoZGQYAQUeX19Db250cm9sc1JlcXVpcmVQb3N0QmFja0tleV9fFgIFPGN0bDAwJHdvcmthcmVhJGxvZ291dFBhZ2VWaWV3JGN0bDAwJGxvZ2luJGN0bDAwJGNieEF1dG9Mb2dpbgU4Y3RsMDAkd29ya2FyZWEkbG9nb3V0UGFnZVZpZXckY3RsMDAkbG9naW4kY3RsMDAkYnRuTG9naW4%3D&ctl00%24workarea%24logoutPageView%24ctl00%24login%24ctl00%24tbxHandle=piesrtasty&ctl00%24workarea%24logoutPageView%24ctl00%24login%24ctl00%24tbxPassword=shutup&ctl00%24workarea%24logoutPageView%24ctl00%24login%24ctl00%24btnLogin.x=14&ctl00%24workarea%24logoutPageView%24ctl00%24login%24ctl00%24btnLogin.y=15&__EVENTTARGET=&__EVENTARGUMENT=",
		headers: {
			'Content-type': 'application/x-www-form-urlencoded'
		}
	}, function (error, response, body)	{
		
		request({url: "http://www.match.com/search/search.aspx?EXEC=GO&SB=radius&lid=226&cl=1&gc=1&tr=2&lage=18&uage=35&ua=35&pc=07028&dist=50&po=1&oln=0&do=2&kw=nyc"}, function (error, response, body)	{
			var newDoc = jsdom.env(body, ['http://code.jquery.com/jquery-1.5.min.js'], function (errors, window)	{
				var $ = window.jQuery;
				
				var usernames = [];
				
				$("span.username").each(function()	{
					var username = $(this).text();
					username = username.substring(4, username.length - 3);
					usernames.push(username);
				});
				


				
			});

		});

	});

// }