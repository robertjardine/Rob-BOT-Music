const recommendService = require('../services/recommend.service');

exports.getPlaylist = function(req, res, next) {
    let userId = req.query.userId;
    var playlist = recommendService.getPlaylist(userId);
    playlist.then((result) => {
        return res.status(200).json({
            status: 200, 
            data: todos, 
            message: "Recommend Playlist Returned Successfully"
        });
    }).catch((error) => {
        return res.status(400).json({
            status: 400, 
            message: error.message
        }); 
    });
}
