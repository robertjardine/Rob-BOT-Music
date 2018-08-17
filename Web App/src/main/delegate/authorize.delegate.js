const request =  require('request');

const AUTH_OPTIONS = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

exports.authorize = function() {
    return new Promise((resolve, reject) => {
        request.post(AUTH_OPTIONS, (error, response, body) => {
            var token = body.access_token;
            var options = {
                url: `https://accounts.spotify.com/authorize/
                        ?client_id=${process.env.CLIENT_ID}&response_type=code
                        &redirect_uri=${process.env.REDIRECT_URI}
                        &scope=user-read-private%20user-read-email&state=34fFs29kd09`,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
        });
    });
}