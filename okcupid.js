var request = require('request'),
  jsdom = require('jsdom'),
  mongoose = require('/usr/local/lib/node_modules/mongoose'),
  db = mongoose.connect('mongodb://localhost/ok-cupid-messages'),
  Schema = mongoose.Schema,
  ObjectId = Schema.ObjectId; 

// Create a new mongoose schema to store messages
var Message = new Schema({
  toUsername: String
});

var MyMessage = mongoose.model('Message', Message);

// Create a Main OkCupid function
OkCupid = function(){}; 

OkCupid.prototype.copyInbox = function()  {

  request({
    url: "http://www.okcupid.com/login",
    method: "post",
    body: "p=&dest=&username=piesrtasty&password=shutup%211",
    headers: {
      'Content-type' : 'application/x-www-form-urlencoded'
    }
  },  function  (error, response, body)  {
    var newDoc = jsdom.env(body, ['http://code.jquery.com/jquery-1.5.min.js'], function (errors, window)  {
      var $ = window.jQuery;
      var messagesUrl = $("#nav_messages a").attr("href");
      request({

      }, function (error, response, body) {

      });
    });
  });

} 

OkCupid.prototype.sendMessage = function() {

}

// Extend the OkCupid function's prototype with an init method
OkCupid.prototype.init = function(sortByType) {

  var messsageCount = 0;

  request({uri: 'http://www.okcupid.com/login'}, function (error, response, body) {
    
    // If there is no error
    if (!error && response.statusCode == 200) {
    // console.log(body) // Print the google web page.
    }

    var numTimes = 0
    while (numTimes < 5)  {
    // Instantiate a new jsdom object
       jsdom.env({
      html: body,
      scripts: [
        'http://code.jquery.com/jquery-1.5.min.js'
      ]
      }, function (err, window) {
      var $ = window.jQuery;
      request({
        url    : "http://www.okcupid.com/login",
        method : "post",
        body   : "p=&dest=&username=virtuallyghetto&password=shutup%211",
        // body   : "p=&dest=&username=okcupidmatcher&password=nomorenerds",
        headers : {
          'Content-type' : 'application/x-www-form-urlencoded'
        }
      },function (error, response, body) {
        var newDoc = jsdom.env(body, ['http://code.jquery.com/jquery-1.5.min.js'], function (errors, window) {
        var $ = window.jQuery;       
        var matchesUrl = $("#nav_matches a").attr("href");

        // console.log(sortByType);
        
        request({
          // url    : "http://www.okcupid.com/match?timekey=1&matchOrderBy=SPECIAL_BLEND&use_prefs=1&discard_prefs=1&matchSortRelative=1",
          url    : "http://www.okcupid.com/match?timekey=1&matchOrderBy=" + sortByType + "&use_prefs=1&discard_prefs=1&matchSortRelative=1",
          method : 'get',
          body   : '',
          headers : {
            'Content-type' : 'text/html; charset=utf-8'
          }
        },function (error, response, body) {
          // this assumes no error for brevity.
          var newDoc = jsdom.env(body, ['http://code.jquery.com/jquery-1.5.min.js'], function (errors, window) {
            var $ = window.jQuery;
            var usernames = [];
            $("span.username").each(function()  {
              usernames.push($(this).text());
            })
            for ( var i = 0; i < usernames.length; i ++ ) {
              var name = "Luke";
              (function (i, name) {
                // console.log("Name is " + name);
                this.name = name;
                console.log(this.name);

                var user = usernames[i];
                // console.log("User #" + i + " : " + user);
                
                MyMessage.findOne({ toUsername: user}, function (err, doc){
                  if (doc == null)  {
                    var instance = new MyMessage();
                    instance.toUsername = user;
                    instance.save(function (err) {
                      if ( err )  { console.log(err) }    
                    });
                    // console.log("Messaged: " + user);
                    request({
                      url    : "http://www.okcupid.com/mailbox",
                      method : "post",
                      // body: "ajax=1&sendmsg=1&r1=" + user + "&subject=&body=Hi%20I'm%20Luke!%20So%20I%20think%20I'm%20supposed%20to%20message%20you%20because%20you%20keep%20popping%20up%20under%20'You%20might%20like'%20and%20every%20time%20I%20look%20at%20your%20profile%20I%20think%20you're%20super%20cool%20and%20find%20it%20hard%20to%20write%20a%20message%20because%20of%20your%20eclecticism%2C%20which%20is%20actually%20really%20awesome%20when%20you%20think%20about%20it.%20But%20I%20actually%20think%20I%20just%20may%20have%20captured%20what%20I%20was%20intending%20to%20write%20%3DP%20&threadid=0&authcode=1%2C0%2C1330986824%2C0x5a7dffa7fa354f88%3Ba4aebeae63c0bcc946b01e441eb062ae3d06916a&reply=0&from_profile=1",
                      // body: "ajax=1&sendmsg=1&r1=" + user + "&subject=&body=Hi%20I'm%20Luke!%20So%20I%20think%20I'm%20supposed%20to%20message%20you%20because%20you%20keep%20popping%20up%20under%20'You%20might%20like'%20and%20every%20time%20I%20look%20at%20your%20profile%20I%20think%20you're%20super%20cool%20and%20find%20it%20hard%20to%20write%20a%20message%20because%20of%20your%20eclecticism%2C%20which%20is%20actually%20really%20awesome%20when%20you%20think%20about%20it.%20But%20I%20actually%20think%20I%20just%20may%20have%20captured%20what%20I%20was%20intending%20to%20write%20%3DP%20&threadid=0&authcode=1%2C0%2C1331346538%2C0x3c555cf6c4f6d5af%3B8bdbf2ced294fe3854a132b1219254153b7c02e3&reply=0&from_profile=1",
                      body: "ajax=1&sendmsg=1&r1=" + user + "&subject=&body=Hi%20I'm%20Luke!%20So%20I%20think%20I'm%20supposed%20to%20message%20you%20because%20you%20keep%20popping%20up%20under%20'You%20might%20like'%20and%20every%20time%20I%20look%20at%20your%20profile%20I%20think%20you're%20super%20cool%20and%20find%20it%20hard%20to%20write%20a%20message%20because%20of%20your%20eclecticism%2C%20which%20is%20actually%20really%20awesome%20when%20you%20think%20about%20it.%20But%20I%20actually%20think%20I%20just%20may%20have%20captured%20what%20I%20was%20intending%20to%20write%20%3DP%20&threadid=0&authcode=1%2C0%2C1331567978%2C0x3c555cf6c4f6d5af%3B2177e8efe118ab7c2d413913f25d47382e3b66cf&reply=0&from_profile=1",
                      headers : {
                        'Content-type' : "application/x-www-form-urlencoded"
                      }
                    },function(error, response, body) {
                      if ( error ) { console.log(error) }
                      console.log("Messaged: " + user);
                      console.log("Message Count is: " + messsageCount);
                    });    
                  } else  {
                    console.log(doc);
                  }
                // End of MyMessage.find(One);       
                });

              })(i, name);
            // End of For loop  
            }    
          // }
          });
        });

      });
        });
    console.log("This is run number: " + numTimes);
    numTimes++;
    }
  

  });
}); 
}

OkCupid

exports.OkCupid = OkCupid;