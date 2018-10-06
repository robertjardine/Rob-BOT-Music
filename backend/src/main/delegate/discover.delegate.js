const request = require('request');
const dotenv = require('dotenv');
dotenv.config();

const MAX_OFFSET = 9999;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
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

/**
 * Retrieve a random artist id from the Spotify API
 * API has a limit of an offset of 10,000
 * @return { number } id of a Spotify artist
 */
exports.getRandomArtist = function() {
    return new Promise((resolve, reject) => {
        let offset = Math.floor(Math.random() * (MAX_OFFSET + 1));
        let url = `https://api.spotify.com/v1/search?q=year%3A0000-9999&type=artist&limit=1&offset=${offset}`;
        requestToSpotify(url)
            .then(data => resolve(data.artists.items[0].id))
            .catch(error => reject(error));
    });
}

/**
 * Uses an artist Id to retrieve the artist's top songs from the Spoitfy API
 * @param { number } artistId Number that uniquely identifies an artists in the Spotify API
 * @return { Track[] } Array of Track objects that contain the top songs for the artist Id
 */
exports.getTopSongs = function(artistId) {
    return new Promise((resolve, reject) => {
        let url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;
        requestToSpotify(url)
            .then(data => resolve(data.tracks))
            .catch(error => reject(error));
    });  
}

/**
 * Make a GET request to the Spotify API with the given url
 * @param { string } url Address for the GET request to the Spotify API
 * @returns { Promise } Contains the response data
 */
function requestToSpotify(url) {
    return new Promise((resolve, reject) => {
        request.post(AUTH_OPTIONS, (error, response, body) => {
            let token = body.access_token;
            let options = {
                url: url,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    });
}
