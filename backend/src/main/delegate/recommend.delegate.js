const request =  require('request');

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

exports.getFavorites = function() {
    let url = `https://api.spotify.com/v1/me/tracks`;
    requestToSpotify(url)
        .then(data => data)
        .catch(error => error);
}

/**
 * Get the artist for the given artist id
 * @param { number } artistId Unique identifier for an artist in the Spotify API
 * @return { Artist } Artist object found by given id
 */
exports.getArtistByArtistId = function(artistId) {
    let url = `https://api.spotify.com/v1/artists/${id}`;
    requestToSpotify(url)
        .then(data => data)
        .catch(error => error);
}

/**
 * Get related artists for the given artist id
 * @param { number } artistId Unique identifier for an artist in the Spotify API
 * @return { Artist[] } List of Artist objects
 */
exports.getRelatedArtistByArtistId = function(artistId) {
    let url = `https://api.spotify.com/v1/artists/${artistId}/related-artists`;
    requestToSpotify(url)
        .then(data => data)
        .catch(error => error);
}

/**
 * Get the top songs for a given artist id
 * @param { number } artistId 
 * @return { number[] } Array of ids for the retrieved top songs
 */
exports.getTopSongsByArtistId = function(artistId) {
    let url = `https://api.spotify.com/v1/artist/${artistId}/top-songs`;
    requestToSpotify(url)
        .then(data => data)
        .catch(error => error);
}

/**
 * Retrieve the audio features for a given track id in the Spotify API
 * @param { number } trackId Unique id for a track within the Spotify API
 * @return { AudioFeatures } Object with audio features for a given track id
 */
exports.getAudioFeaturesByTrackId = function(trackId) {
    let url = `https://api.spotify.com/v1/tracks/audio-features/${trackId}`;
    requestToSpotify(url)
        .then(data => data)
        .catch(error => error);
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
            }
            request.get(options, function(error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    });
}