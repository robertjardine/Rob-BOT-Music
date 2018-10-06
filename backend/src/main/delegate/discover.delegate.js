const spotifyDelegate = require('../delegate/spotify.delegate');

const MAX_OFFSET = 9999;

/**
 * Retrieve a random artist id from the Spotify API
 * API has a limit of an offset of 10,000
 * @return { number } id of a Spotify artist
 */
exports.getRandomArtist = function() {
    return new Promise((resolve, reject) => {
        let offset = Math.floor(Math.random() * (MAX_OFFSET + 1));
        let url = `https://api.spotify.com/v1/search?q=year%3A0000-9999&type=artist&limit=1&offset=${offset}`;
        spotifyDelegate.requestToSpotify(url)
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
        spotifyDelegate.requestToSpotify(url)
            .then(data => resolve(data.tracks))
            .catch(error => reject(error));
    });  
}
