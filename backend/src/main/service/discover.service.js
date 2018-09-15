/**
 * Due to Spotify search limitations:
 * Random artist (Top 10,000) will be chosen.
 * A random song from this artist will then be added to the playlist. 
 */

const discoverDelegate = require('../delegate/discover.delegate');

const NUM_SONGS_IN_PLAYLIST = 20;

/**
 * TODO: No duplicate artist/track ids
 */
exports.getDiscoverPlaylist = function() {
    return new Promise((resolve, reject) => {
        let playlist = [];
        let topSongPromises = [];
        for (let i=0; i<NUM_SONGS_IN_PLAYLIST; i++) {
            topSongPromises.push(new Promise((resolve, reject) => {
                let artistId = discoverDelegate.getRandomArtist();
                artistId.then(data => {
                    let randomSong = discoverDelegate.getTopSongs(data);
                    randomSong.then(data => {
                        if (data && data.length > 0) {
                            let index = Math.floor(Math.random() * (data.length));
                            playlist.push(data[index]);
                            resolve(data[index]);
                        } else {
                            resolve();
                        }
                    }).catch((error) => {
                        reject(error);
                    });
                }).catch((error) => {
                    reject(error);
                });
            }));
        }
        Promise.all(topSongPromises).then((results) => {
            resolve(playlist);
        }).catch((error) => {
            reject(error);
        });
    });
}
