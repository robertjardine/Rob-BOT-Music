/**
 * 1. Get favorites
 * 2. Get all artist from favorites
 * 3. Get all related artists from artists
 * 4. Collect all top songs from all the artists
 * 5. Run in network and get top results
 */
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
    return new Promise((resolve, reject) => {
        request.post(AUTH_OPTIONS, (error, response, body) => {
            var token = body.access_token;
            var options = {
                url: "https://api.spotify.com/v1/me/tracks",
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

/**
 * TODO: Returns before finished
 */
exports.getMainArtists = function(trackIds) { 
    return new Promise((resolve, reject) => {
        let artistIds = [];
        for (let id in trackIds) {
            request.post(AUTH_OPTIONS, (error, response, body) => {
                var token = body.access_token;
                var options = {
                    url: "https://api.spotify.com/v1/artists",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    id: id,
                    json: true
                };
                request.get(options, function(error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    artistIds.push(body.id);
                });
            });
        }
        return artistIds;
    });
}

exports.getRelatedArtists = function(artistIds) {
    return new Promise((resolve, reject) => {
        let artists = [];
        request.post(AUTH_OPTIONS, (error, response, body) => {
            for (let id in artistIds) {
                var token = body.access_token;
                var options = {
                    url: "https://api.spotify.com/v1/artists/" + id + "/related-artists",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                }
                request.get(options, function(error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    // Add array result to final array
                    for (let artist in body) {
                        artists.push(artist.id);
                    }
                });   
            }
            resolve(artists);
        });
    });
}

exports.getTopSongs = function(artistIds) {
    return new Promise((resolve, reject) => {
        let trackIds = [];
        for (let id in artistIds) {
            request.post(AUTH_OPTIONS, (error, response, body) => {
                var token = body.access_token;
                var options = {
                    url: "https://api.spotify.com/v1/artist/" + id + "/top-songs",
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                }
                request.get(options, function(error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    for (let track in body) {
                        trackIds.push(track.id);
                    }
                });
            });
        }
        resolve(trackIds);
    });
}

exports.getAudioFeatures = function(trackIds) {
    return new Promise((resolve, reject) => {
        let tracks = [];
        for (let id in trackIds) {
            request.post(AUTH_OPTIONS, (error, response, body) => {
                var token = body.access_token;
                var options = {
                    url: "https://api.spotify.com/v1/tracks/audio-features" + id,
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    json: true
                }
                request.get(options, function(error, response, body) {
                    if (error) {
                        reject(error);
                    }
                    tracks.concat(body);
                });
            });
        }
        resolve(tracks);
    });
}
