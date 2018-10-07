const discoverService = require('../service/discover.service');
const spotifyDelegate = require('../delegate/spotify.delegate');

exports.getDiscoverPlaylist = async function(req, res) {
    try {
        let result = await discoverService.getDiscoverPlaylist();
        res.render("main", {randomTracks: result});
    } catch (error) {
        return res.status(400).json({
            status: 400, 
            message: error.message
        }); 
    }
};

exports.getTrackById = async function(req, res) {
    let url = `https://api.spotify.com/v1/tracks/${req.params.trackId}`;
    let track = await spotifyDelegate.requestToSpotify(url)
    res.send(track);
}
