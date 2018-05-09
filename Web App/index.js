const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyparser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');

const brain = require('brain.js');

var app = express();
const port = 8006;

// Hides information about the server from the header
app.disable('x-powered-by');

// Template engine attributes
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

// CONSTANT VARIABLES
const client_id = '19a5e88685af46759ece15d390334bd5'; // Your client id
const client_secret = '25e0127d9eb9466aa7d4e7f92176a535'; // Your secret
const redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
// your application requests authorization
const authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
    },
    form: {
        grant_type: 'client_credentials'
    },
    json: true
};

function getSongInfo(songInfo) {
    return new Promise((resolve, reject) => {
        var lineReader = readline.createInterface({
            input: fs.createReadStream('./data/song-info.txt')
        });
            
        lineReader.on('line', (line) => {
            line = line.slice(1, -1);

            rightBracket = line.indexOf('{');
            leftBracket = line.indexOf('}');
            while (rightBracket !== -1) {
                let currObject = JSON.parse(line.substring(rightBracket, leftBracket + 1));
                songInfo.push(currObject);
                line = line.substring(leftBracket + 1);
                rightBracket = line.indexOf('{');
                leftBracket = line.indexOf('}');
            }
        });

        lineReader.on('close', () => {
            resolve("/ songInfoPromise Success");
        });
    });
}

function getPlaylistItems(songInfo, network) {
    let recommendPlaylist = [];
    for (let i=0; i<songInfo.length; i++) {
        let rating = network.run({
            acousticness: songInfo[i].acousticness,
            danceability: songInfo[i].danceability,
            energy: songInfo[i].energy,
            instrumentalness: songInfo[i].instrumentalness,
            liveness: songInfo[i].liveness,
            speechiness: songInfo[i].speechiness,
            valence: songInfo[i].valence
        });
        // let rating = network.run({input: songInfo[i]});
        let currSong = {
            rating: rating,
            songInfo: songInfo[i]
        };
        if (i < 20) {
            recommendPlaylist.push( currSong );
        } else {
            let minimum = -1;
            for (let j=0; j<20; j++) {
                if (currSong.rating.like > recommendPlaylist[j].rating.like) {
                    recommendPlaylist.push(currSong);
                    minimum = j;
                    break;
                }
            }
            if (minimum !== -1) {
                for (let k=0; k<recommendPlaylist; k++) {
                    if (recommendPlaylist[minimum].rating.like > recommendPlaylist[k].rating.like) {
                        minimum = k;
                    }
                }
                recommendPlaylist.splice(minimum, 1);
            }
        }
    }
    return recommendPlaylist;
}

function getTrackInfo(trackId, stuff, index) {
    return new Promise((resolve, reject) => {
        request.post(authOptions, (error, response, body) => {
            var token = body.access_token;
            var options = {
                url: 'https://api.spotify.com/v1/tracks/' + trackId,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                stuff[index] = body;
                resolve("/ trackInfo GOOD");
            });
        });
    });
}

/* 
 * ROUTES 
 */

// GET ALL OF THE PLAYLIST SONG INFORMATION
app.get('/playlist', (req, res) => {
    let network = new brain.NeuralNetwork();
    // Get Neural Network from file
    const networkPromise = loadNeuralNetwork(network);

    // Get all song information
    let songInfo = [];
    const songInfoPromise = getSongInfo(songInfo);
    
    let promises = [];
    Promise.all([networkPromise, songInfoPromise]).then(() => {
        // GET TOP 20 SONG RECOMMENDATIONS
        let recommendPlaylist = getPlaylistItems(songInfo, network);
        let promises = [];
        let trackInfo = [...Array(recommendPlaylist.length)];
        for (let i=0; i<recommendPlaylist.length; i++) {     
            promises.push(getTrackInfo(recommendPlaylist[i].songInfo.id, trackInfo, i));
        }

        Promise.all(promises).then(() => {
            // RENDER PAGE
            res.render('main', {
                playlist: recommendPlaylist,
                trackInfo: trackInfo
            }); 
        });   
    });
});

app.get('/train', (req, res) => {
    let songIds = [];
    let result = [];
    let trackInfo = [...Array(20)];
    let audioInfo = [...Array(20)];

    // Get all Song Ids
    const readFilePromise = getSongObjects(songIds);

    readFilePromise.then(() => {
        for (let i=0; i<20; i++) {
            let randomIndex = Math.floor(Math.random() * Math.floor(songIds.length - 1));
            let randomSong = songIds[randomIndex];
            result.push(randomSong);
        }
        var promises = [];
        for (let i=0; i<result.length; i++) {
            promises.push(getTrackInfo(result[i], trackInfo, i));
            promises.push(getAudioFeatures(result[i], audioInfo, i));
        }
        Promise.all(promises).then((value) => {
            res.render('user-train', {
                randomTrackInfo: trackInfo,
                audioInfo: audioInfo,
                index: 0
            });
        });
    })
});

// Update network when song liked
app.get('/rating', (req, res) => {
    let audioInfo = JSON.parse(req.query.audioInfo);
    let index = Number(req.query.index);
    let likeOrUnlike = Number(req.query.likeOrUnlike);
    let songInfo = [...Array(20)];

    let network = new brain.NeuralNetwork();
    const neuralNetworkPromise = updateNeuralNetwork(audioInfo, network, likeOrUnlike, index);

    neuralNetworkPromise.then(() => {
        let songPromises = [];
        for (let i=0; i<audioInfo.length; i++) {
            songPromises.push(getTrackInfo(audioInfo[i].id, songInfo, i));
        }
        Promise.all(songPromises).then(() => {
            res.render('user-train', {
                randomTrackInfo: songInfo,
                audioInfo: audioInfo,
                index: index + 1
            }); 
        });
    });
});

// Update network when song liked
// app.get('/ratingFromPlaylist', (req, res) => {
//     let audioInfo = JSON.parse(req.query.audioInfo);
//     let likeOrUnlike = Number(req.query.likeOrUnlike);
//     let songInfo = [...Array(20)];

//     let network = new brain.NeuralNetwork();
//     const neuralNetworkPromise = updateNeuralNetwork(audioInfo, network, likeOrUnlike, index);

//     neuralNetworkPromise.then(() => {
//         let songPromises = [];
//         for (let i=0; i<audioInfo.length; i++) {
//             songPromises.push(getTrackInfo(audioInfo[i].id, songInfo, i));
//         }
//         Promise.all(songPromises).then(() => {
//             res.render('main', {
//                 randomTrackInfo: songInfo,
//                 audioInfo: audioInfo,
//             }); 
//         });
//     });
// });

/********** Neural Network Helpers ***********/

function loadNeuralNetwork(network) {
    return new Promise((resolve, reject) => {
        fs.readFile('./data/neural-network.txt', (err, data) => {
            if (err) {
                reject('/like readPromise Failure');
            } else {
                network.fromJSON(JSON.parse(data));
                resolve('/like readPromise Success');
            }
        });
    });
}

function writeNeuralNetwork(network) {
    return new Promise((resolve, reject) => {
        fs.writeFile('./data/neural-network.txt', JSON.stringify(network), (err) => {
            if (err) {
                console.log("/like Darn");
                reject('Write Network Failure');
            } 
            console.log("/like Neural Network Saved To File");
            resolve('Write Network Success');
        });
    });
}

function updateNeuralNetwork(audioInfo, network, likeOrUnlike, index) {
    return new Promise((resolve, reject) => {
        var stats = fs.statSync('./data/neural-network.txt');
        var fileSizeInBytes = stats["size"];
        let promises = [];
        if (fileSizeInBytes > 0) {
            // Read & Update Network
            promises.push(loadNeuralNetwork(network));
        }
        Promise.all(promises).then(() => {
            if (likeOrUnlike === 1) {
                network.train([{
                    input: {
                        acousticness: audioInfo.acousticness,
                        danceability: audioInfo.danceability,
                        energy: audioInfo.energy,
                        instrumentalness: audioInfo.instrumentalness,
                        liveness: audioInfo.liveness,
                        speechiness: audioInfo.speechiness,
                        valence: audioInfo.valence
                    }, 
                    output: {like: 1, unlike: 0}
                }]);
            } else {
                network.train([{
                    input: {
                        acousticness: audioInfo.acousticness,
                        danceability: audioInfo.danceability,
                        energy: audioInfo.energy,
                        instrumentalness: audioInfo.instrumentalness,
                        liveness: audioInfo.liveness,
                        speechiness: audioInfo.speechiness,
                        valence: audioInfo.valence
                    }, 
                    output: {like: 0, unlike: 1}
                }]);
            }
            
            const writePromise = writeNeuralNetwork(network);
            writePromise.then(() => {
                resolve('Update Network Success');
            });
        });
    })
}


/********** Get file contents helpers **************/

function getSongObjects(songIds) {
    return new Promise((resolve, reject) => {
        var lineReader = readline.createInterface({
            input: fs.createReadStream('./data/song-objects.txt')
        });
        lineReader.on('line', (line) => {
            songIds.push(line);
        });
        lineReader.on('close', () => {
            resolve("/train readFilePromise Success");
        });
    });   
}

function getAudioFeatures(trackId, audioInfo, index) {
    return new Promise((resolveLoop, reject) => {
        request.post(authOptions, (error, response, body) => {
            var token = body.access_token;
            var options = {
                url: 'https://api.spotify.com/v1/audio-features/' + trackId,
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                json: true
            };
            request.get(options, function(error, response, body) {
                audioInfo[index] = body;
                resolveLoop("audioPromise GOOD");
            });
        });
    });
}

/********** App Listening ************/

app.listen(port, () => {
    // Log Server started
    console.log("Express started!");
});