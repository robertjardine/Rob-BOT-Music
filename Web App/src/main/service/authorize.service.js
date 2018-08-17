const authorizeDelegate = require('../delegate/authorize.delegate');

exports.authorize = function() {
    return new Promise((resolve, reject) => {
        let result = authorizeDelegate.authorize();
        result.then((result) => {
            resolve(result);
        }).catch((err) => {
            reject(err);
        });
    });
}
