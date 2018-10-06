const request = require('request');
const dotenv = require('dotenv');
dotenv.config();


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
 * Make a GET request to the Spotify API with the given url
 * @param { string } url Address for the GET request to the Spotify API
 * @returns { Promise } Contains the response data
 */
exports.requestToSpotify = function(url) {
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
