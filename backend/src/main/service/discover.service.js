const spotifyDelegate = require('../delegate/spotify.delegate');

const NUM_SONGS_IN_PLAYLIST = 15;
const MAX_OFFSET = 9999;

/**
 * Generate a random list of Track objects of length NUM_SONGS_IN_PLAYLIST
 * @return { Track[] } Array of random songs
 */
exports.getDiscoverPlaylist = function() {
    return new Promise((resolve, reject) => {
        let topSongPromises = [];
        for (let i=0; i<NUM_SONGS_IN_PLAYLIST; i++) {
            topSongPromises.push(getRandomTrack());
        }
        Promise.all(topSongPromises)
            .then(results => resolve(results))
            .catch(error => reject(error));
    });    
}

/**
 * Retrieve a random Track
 * @return { Track } Random top track from a random artist
 */
function getRandomTrack() {
    return new Promise(async (resolve, reject) => {
        try {
            let randomArtistId = await getRandomArtist();
            let randomArtistTopSongs = null;
            do {
                randomArtistTopSongs = await getTopSongs(randomArtistId);
            } while (!randomArtistTopSongs || randomArtistTopSongs.length == 0);
            let index = randomIndexGenerator(randomArtistTopSongs.length-1);
            resolve(randomArtistTopSongs[index]);
        } catch (error) {
            reject(error);
        }
    });          
}

/**
 * Retrieve a random artist id from the Spotify API
 * API has a limit of an offset of 10,000
 * @return { number } id of a Spotify artist
 */
function getRandomArtist() {
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
function getTopSongs(artistId) {
    return new Promise((resolve, reject) => {
        let url = `https://api.spotify.com/v1/artists/${artistId}/top-tracks?country=US`;
        spotifyDelegate.requestToSpotify(url)
            .then(data => resolve(data.tracks))
            .catch(error => reject(error));
    });  
}

/**
 * Generate a random number between two values
 * @param { int } maxIndex Maximum accepted number
 * @param { int } minIndex Minimum accepted number (Defaults to 0)
 * @return { int } Randomly generated number
 */
function randomIndexGenerator(maxIndex, minIndex = 0) {
    return Math.floor(Math.random() * (maxIndex - minIndex + 1) + minIndex);
}
