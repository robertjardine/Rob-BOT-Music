const discoverService = require('../service/discover.service');

exports.getDiscoverPlaylist = function(req, res) {
    var playlistPromise = discoverService.getDiscoverPlaylist();
    playlistPromise.then((result) => {
        // console.log(`\n\n\n ${result.length} \n\n\n`);
        res.render("main", {
            randomTrackInfo: result
            // audioInfo: audioInfo,
        });
              
    }).catch((error) => {
        return res.status(400).json({
            status: 400, 
            message: error.message
        });     
    }); 
};