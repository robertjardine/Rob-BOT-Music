const authorizeService = require('../service/authorize.service');

exports.authorize = function(req, res) {
    var authorizePromise = authorizeService.authorize();
    authorizePromise.then((result) => {
        return res.status(200).json({
            status: 200, 
            data: result, 
            message: "Authorize Successful"
        });
    }).catch((error) => {
        return res.status(400).json({
            status: 400, 
            message: error.message
        });     
    }); 
};