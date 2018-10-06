const discoverDelegate = require('../delegate/discover.delegate');

const NUM_SONGS_IN_PLAYLIST = 15;

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
 * TODO: Take care of null top songs
 * Retrieve a random Track
 * @return { Track } Random top track from a random artist
 */
function getRandomTrack() {
    return new Promise(async (resolve, reject) => {
        try {
            let randomArtistId = await discoverDelegate.getRandomArtist();
            let randomArtistTopSongs = null;
            do {
                randomArtistTopSongs = await discoverDelegate.getTopSongs(randomArtistId);
            } while (!randomArtistTopSongs || randomArtistTopSongs.length == 0);
            let index = randomIndexGenerator(randomArtistTopSongs.length-1);
            resolve(randomArtistTopSongs[index]);
        } catch (error) {
            reject(error);
        }
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
