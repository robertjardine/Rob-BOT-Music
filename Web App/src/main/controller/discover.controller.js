const discoverService = require('../services/discover.service');

exports.getDiscoverPlaylist = function(req, res) {
    var playlistPromise = discoverService.getDiscoverPlaylist();
    playlistPromise.then((result) => {
        return res.status(200).json({
            status: 200, 
            data: result, 
            message: "Discover Playlist Generated"
        });
    }).catch((error) => {
        return res.status(400).json({
            status: 400, 
            message: error.message
        });     
    }); 
};