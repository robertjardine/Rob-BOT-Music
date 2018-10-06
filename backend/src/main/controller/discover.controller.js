const discoverService = require('../service/discover.service');

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