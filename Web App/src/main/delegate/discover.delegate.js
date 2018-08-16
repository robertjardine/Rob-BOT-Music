const request = require('request');
var dotenv = require('dotenv');
dotenv.config();

const MAX_OFFSET = 9999;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const AUTH_OPTIONS = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

exports.getRandomArtist = function() {
    let offset = Math.floor(Math.random() * (MAX_OFFSET + 1));
    return new Promise((resolve, reject) => {
        request.post(AUTH_OPTIONS, (error, response, body) => {
            var token = body.access_token;
            var options = {
                url: "https://api.spotify.com/v1/search?q=year%3A0000-9999&type=artist&limit=1&offset=" + offset,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            }
            request.get(options, function(error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body.artists.items[0].id);
            });
        });
    });
}

exports.getTopSongs = function(artistId) {
    return new Promise((resolve, reject) => {
        request.post(AUTH_OPTIONS, (error, response, body) => {
            var token = body.access_token;
            var options = {
                url: 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks?country=US',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body.tracks);
            });
        });
    });
}
