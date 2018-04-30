/**
 * There's no way this file could be written any better
 */
const fs = require('fs');
const Bottleneck = require('bottleneck');
const limiter = new Bottleneck({
	maxConcurrent:1,
	minTime:2000
});
var ids = [];
var lineReader = require('readline').createInterface({
  input: require('fs').createReadStream('../artistIDList.txt')
});

lineReader.on('line', function (line) {
  ids.push(line);
});

var request = require('request'); // "Request" library
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
limiter.submit(request.post,authOptions,function(error, response, body) {
	var alphabet = 'abcdefghijklmnopqrstuvwxyz';
	var results = [];
	for(var j=0; j<2000; j++) { // NOTICE: HARDCODED VALUE, CHANGE WITH CHANGES TO artistIDList.txt LENGTH
		var filename = "topSongs.txt";
        var currentArtistID = ids[j];
        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/artists/'+currentArtistID+"/top-tracks?country=US",
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, function(error, response, body) {
            //console.log(JSON.stringify(body,null,2));
            //console.log("\n\n");
            results.push(body);
            
            fs.appendFileSync("../outputs/" + filename,JSON.stringify(body,null,2) + "^", function(err) {
                if(err) {
                    console.log("ERROR:");
                    return console.log(err);
                }
                console.log("saved file");
            });

        });
			
	}
	//result = JSON.stringify(results,null,2);
	//console.log(result);
	
});
/*
request.post(authOptions, function(error, response, body) {
	var alphabet = 'abcdefghijklmnopqrstuvwxyz';
	var results = [];
	for(var j=0; j<200; j++) {
		var filename = "topSongs.txt";
        var currentArtistID = ids[j];
        // use the access token to access the Spotify Web API
        var token = body.access_token;
        var options = {
          url: 'https://api.spotify.com/v1/artists/'+currentArtistID+"/top-tracks?country=US",
          headers: {
            'Authorization': 'Bearer ' + token
          },
          json: true
        };
        request.get(options, function(error, response, body) {
            //console.log(JSON.stringify(body,null,2));
            //console.log("\n\n");
            results.push(body);
            
            fs.appendFileSync("../outputs/" + filename,JSON.stringify(body,null,2) + "^", function(err) {
                if(err) {
                    console.log("ERROR:");
                    return console.log(err);
                }
                console.log("saved file");
            });

        });
			
	}
	//result = JSON.stringify(results,null,2);
	//console.log(result);
	
});*/