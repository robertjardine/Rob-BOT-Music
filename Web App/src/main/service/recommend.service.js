const recommendDelegate = require('../delegates/recommend.delegate.js');
const recommendRepository = require('../repository/recommend.repository');

const NUM_SONGS_IN_PLAYLIST = 20;
const LOUDNESS_LOW = -60;
const LOUDNESS_HIGH = 0;
const DURATION_MS_HIGH = 420000;
const DURATION_MS_LOW = 0;
const KEY_HIGH = 11;
const KEY_LOW = 0;

exports.getPlaylist = function(userId) {
    return new Promise((resolve, reject) => {
        let network = recommendRepository.getNetwork(userId);
        let favorites = recommendDelegate.getFavorites();
        let mainArtists = recommendDelegate.getMainArtists(favorites);
        let relatedArtists = recommendDelegate.getRelatedArtists(mainArtists);
        let topSongIds = recommendDelegate.getTopSongs(relatedArtists);
        let topSongsAudioFeatures = recommendDelegate.getAudioFeatures(topSongIds);
        let playlist = getRecommendations(network, topSongsAudioFeatures);
        return playlist;
    });
}

function getRecommendations(network, topSongs) {
    let playlist = [];
    let lowestRating = Number.MIN_SAFE_INTEGER;
    for (let i=0; i<topSongs.length; i++) {
        let rating = network.run({
            input: {
                acousticness: audioInfo.acousticness,
                danceability: audioInfo.danceability,
                energy: audioInfo.energy,
                instrumentalness: audioInfo.instrumentalness,
                liveness: audioInfo.liveness,
                speechiness: audioInfo.speechiness,
                valence: audioInfo.valence,
                loudness: naturalizeLoudness(audioInfo.loudness),
                key: naturalizeKey(audioInfo.key),
                duration_ms: naturalizeDurationMs(audioInfo.duration_ms)
            }
        });
        if (playlist.length < NUM_SONGS_IN_PLAYLIST) {
            playlist.push({
                id: topSongs[i],
                rating: rating
            });
            playlist.sort((a,b) => {
                return a.rating - b.rating;
            });
            lowestRating = playlist[playlist.length - 1];
        } else {
            if (rating > lowestRating) {
                playlist.pop();
                for (let j=0; j<playlist.length; j++) {
                    if (playlist[j].rating >= rating) {
                        playlist.splice(j, 0, {
                            id: topSongs[i],
                            rating: rating
                        });
                    }
                }
            }
        }
    }
    return playlist;
}

exports.naturalizeLoudness = function(value) {
    let result;
    if (value > LOUDNESS_HIGH) {
        result = LOUDNESS_HIGH;
    } else if (value < LOUDNESS_LOW) {
        result = LOUDNESS_LOW
    } else {
        result = (value / (LOUDNESS_HIGH + LOUDNESS_LOW))
    }
    return result;
}

exports.naturalizeKey = function(value) {
    let result;
    if (value > KEY_HIGH) {
        result = KEY_HIGH;
    } else if (value < KEY_LOW) {
        result = KEY_LOW
    } else {
        result = (value / (KEY_HIGH + KEY_LOW))
    }
    return result;
}

exports.naturalizeDurationMs = function(value) {
    let result;
    if (value > DURATION_MS_HIGH) {
        result = DURATION_MS_HIGH;
    } else if (value < DURATION_MS_LOW) {
        result = DURATION_MS_LOW
    } else {
        result = (value / (DURATION_MS_HIGH + DURATION_MS_LOW))
    }
    return result;
}
