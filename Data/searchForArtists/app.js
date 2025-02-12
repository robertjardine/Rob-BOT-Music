/**
 * This is an example of a basic node.js script that performs
 * the Client Credentials oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 */

var request = require('request'); // "Request" library
const fs = require('fs');
var client_id = '19a5e88685af46759ece15d390334bd5'; // Your client id
var client_secret = '25e0127d9eb9466aa7d4e7f92176a535'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
// your application requests authorization
var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  headers: {
    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
  },
  form: {
    grant_type: 'client_credentials'
  },
  json: true
};

request.post(authOptions, function(error, response, body) {
	var alphabet = 'abcdefghijklmnopqrstuvwxyz';
	var results = [];
	for(var j=0; j<26; j++) {
		var filename = "output.txt";
		for(var i=0; i<50; i++) {
			console.log("Letter " + alphabet.charAt(j) + ", part " + (i+1));
			// use the access token to access the Spotify Web API
			var token = body.access_token;
			var options = {
			  url: 'https://api.spotify.com/v1/search?q=artist:' + alphabet.charAt(j) + '*&type=artist&market=US&limit=50&offset=' + (1 + i*50),
			  headers: {
				'Authorization': 'Bearer ' + token
			  },
			  json: true
			};
			request.get(options, function(error, response, body) {
				//console.log(JSON.stringify(body,null,2));
				//console.log("\n\n");
				results.push(body);
				
				//console.log("appending to " + filename);
				fs.appendFileSync("../outputs/" + filename,JSON.stringify(body,null,2) + "^", function(err) {
					if(err) {
						console.log("ERROR:");
						return console.log(err);
					}
					console.log("saved file");
					//??
				});

			});
			
		}
	}
	//result = JSON.stringify(results,null,2);
	//console.log(result);
	
});
