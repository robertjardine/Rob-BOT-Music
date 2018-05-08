const express = require('express');
const pug = require('pug');
const path = require('path');
const bodyparser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
var request = require('request'); // "Request" library
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

/* 
 * ROUTES 
 */

// GET ALL OF THE PLAYLIST SONG INFORMATION
app.get('/', (req, res) => {

    let network = new brain.NeuralNetwork();
    let recommendPlaylist = [];
    // Get Neural Network from file
    const networkPromise = new Promise((resolve, reject) => {
        fs.readFile('./data/neural-network.txt', (err, data) => {
            if (err) {
                console.log("/ Darn...");
                reject('/ networkPromise Failure');
            }
            network.fromJSON(JSON.parse(data));
            console.log("/ NETWORK LOADED");
            resolve('/ networkPromise Success');
        });
    });

    // Get all song information
    let songInfo = [];
    const songInfoPromise = new Promise((resolve, reject) => {
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
    let promises = [];
    Promise.all([networkPromise, songInfoPromise]).then(() => {
        // GET TOP 20 SONG RECOMMENDATIONS
        
        for (let i=0; i<songInfo.length; i++) {
            let currSong = {
                rating: network.run({
                    acousticness: songInfo[i].acousticness,
                    danceability: songInfo[i].danceability,
                    duration_ms: songInfo[i].duration_ms,
                    energy: songInfo[i].energy,
                    instrumentalness: songInfo[i].instrumentalness,
                    key: songInfo[i].key,
                    liveness: songInfo[i].liveness,
                    loudness: songInfo[i].loudness,
                    mode: songInfo[i].mode,
                    speechiness: songInfo[i].speechiness,
                    tempo: songInfo[i].tempo,
                    time_signature: songInfo[i].time_signature,
                    valence: songInfo[i].valence
                }),
                songInfo: songInfo[i]
            };
            if (i < 20) {
                recommendPlaylist.push({ currSong });
            } else {
                var minimum = -1;
                for (let j=0; j<recommendPlaylist.length; j++) {
                    if (currSong.rating[0] > recommendPlaylist[j].currSong.rating[0]) {
                        recommendPlaylist.push(currSong);
                        minimum = j;
                        break;
                    }
                    // Else nothing needs to be done
                }
                if (minimum !== -1) {
                    for (let k=0; k<recommendPlaylist; k++) {
                        if (minimum > recommendPlaylist[k].currSong.rating) {
                            minimum = recommendPlaylist[k].currSong.rating;
                        }
                    }
                    array.splice(minimum, 1);
                }
            }
        }
        let promises = [];
        for (let i=0; i<recommendPlaylist.length; i++) {
            const trackPromise = new Promise((resolve, reject) => {
                var client_id = '19a5e88685af46759ece15d390334bd5'; // Your client id
                var client_secret = '25e0127d9eb9466aa7d4e7f92176a535'; // Your secret
                var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
                // your application requests authorization
                var authOptions = {
                    url: 'https://accounts.spotify.com/api/token',
                    headers: {
                        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
                    },
                    form: {
                        grant_type: 'client_credentials'
                    },
                    json: true
                };
                request.post(authOptions, (error, response, body) => {
                    var token = body.access_token;
                    var options = {
                        url: 'https://api.spotify.com/v1/tracks/' + songInfo[i].id,
                        headers: {
                        'Authorization': 'Bearer ' + token
                        },
                        json: true
                    };
                    request.get(options, function(error, response, body) {
                        recommendPlaylist[i].trackInfo = body;
                        resolve("/ trackInfo GOOD");
                    });
                });
            });
            promises.push(trackPromise);
        }

        Promise.all(promises).then(() => {
            // RENDER PAGE
            res.render('main', {
                playlist: recommendPlaylist
            }); 
        });   
    });
});

app.get('/train', (req, res) => {
    let songIds = [];
    let result = [];
    let trackInfo = [...Array(20)];
    let audioInfo = [...Array(20)];


    // Read file
    const readFilePromise = new Promise((resolve, reject) => {
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

    readFilePromise.then(() => {
        for (let i=0; i<20; i++) {
            let randomIndex = Math.floor(Math.random() * Math.floor(songIds.length - 1));
            let randomSong = songIds[randomIndex];
            result.push(randomSong);
        }
    }).then(() => {
        var client_id = '19a5e88685af46759ece15d390334bd5'; // Your client id
        var client_secret = '25e0127d9eb9466aa7d4e7f92176a535'; // Your secret
        var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri
        // your application requests authorization
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            form: {
                grant_type: 'client_credentials'
            },
            json: true
        };
        var promises = [];
        const reqPromise = new Promise((resolve, reject) => {
            for (let i=0; i<result.length; i++) {
                let loopPromise = new Promise((resolveLoop, reject) => {
                    request.post(authOptions, (error, response, body) => {
                        var token = body.access_token;
                        var options = {
                            url: 'https://api.spotify.com/v1/tracks/' + result[i],
                            headers: {
                            'Authorization': 'Bearer ' + token
                            },
                            json: true
                        };
                        request.get(options, function(error, response, body) {
                            trackInfo[i] = body;
                            resolveLoop("loopPromise GOOD");
                        });
                    });
                });
                let audioPromise = new Promise((resolveLoop, reject) => {
                    request.post(authOptions, (error, response, body) => {
                        var token = body.access_token;
                        var options = {
                            url: 'https://api.spotify.com/v1/audio-features/' + result[i],
                            headers: {
                            'Authorization': 'Bearer ' + token
                            },
                            json: true
                        };
                        request.get(options, function(error, response, body) {
                            audioInfo[i] = body;
                            resolveLoop("audioPromise GOOD");
                        });
                    });
                });
                promises.push(loopPromise);
            }
        });
        
        Promise.all(promises).then(() => {
            res.render('user-train', {
                randomTrackInfo: trackInfo,
                audioInfo: audioInfo
            });
        });
    })
});

// Update network when song liked
app.get('/like', (req, res) => {
    let songInfo = JSON.parse(req.query.songInfo);
    let audioInfo = JSON.parse(req.query.audioInfo);

    let network = new brain.NeuralNetwork();

    // Write Neural Network as JSON object
    var stats = fs.statSync('./data/neural-network.txt');
    var fileSizeInBytes = stats["size"];
    if (fileSizeInBytes > 0) {
        // Read & Update Network
        const readPromise = new Promise((resolve, reject) => {
            fs.readFile('./data/neural-network.txt', (err, data) => {
                if (err) {
                    reject('/like readPromise Failure');
                } else {
                    network.fromJSON(JSON.parse(data));
                    resolve('/like readPromise Success');
                }
            });
        }).then(() => {
            //Update Info
            network.train({input: {
                acousticness: audioInfo.acousticness,
                danceability: audioInfo.danceability,
                duration_ms: audioInfo.duration_ms,
                energy: audioInfo.energy,
                instrumentalness: audioInfo.instrumentalness,
                key: audioInfo.key,
                liveness: audioInfo.liveness,
                loudness: audioInfo.loudness,
                mode: audioInfo.mode,
                speechiness: audioInfo.speechiness,
                tempo: audioInfo.tempo,
                time_signature: audioInfo.time_signature,
                valence: audioInfo.valence
            }, output: [1]});

            // Write back to file
            fs.writeFile('./data/neural-network.txt', JSON.stringify(network), (err) => {
                if (err) {
                    console.log("/like Darn");
                } 
                console.log("/like Neural Network Saved To File");
            });
        });
    } else {
        // Create Network
        network.train({input: {
            acousticness: audioInfo.acousticness,
            danceability: audioInfo.danceability,
            duration_ms: audioInfo.duration_ms,
            energy: audioInfo.energy,
            instrumentalness: audioInfo.instrumentalness,
            key: audioInfo.key,
            liveness: audioInfo.liveness,
            loudness: audioInfo.loudness,
            mode: audioInfo.mode,
            speechiness: audioInfo.speechiness,
            tempo: audioInfo.tempo,
            time_signature: audioInfo.time_signature,
            valence: audioInfo.valence
        }, output: [1]});
        fs.writeFile('./data/neural-network.txt', JSON.stringify(network), (err) => {
            if (err) {
                console.log("/like Darn");
            } 
            console.log("/like Neural Network Saved To File");
        });
    } 
});

// Update network when song disliked
app.get('/disLike', (req, res) => {
    let songInfo = JSON.parse(req.query.songInfo);
    let audioInfo = JSON.parse(req.query.audioInfo);

    let network = new brain.NeuralNetwork();

    // Write Neural Network as JSON object
    var stats = fs.statSync('./data/neural-network.txt');
    var fileSizeInBytes = stats["size"];
    if (fileSizeInBytes > 0) {
        // Read & Update Network
        const readPromise = new Promise((resolve, reject) => {
            fs.readFile('./data/neural-network.txt', (err, data) => {
                if (err) {
                    reject('/disLike readPromise Failure');
                } else {
                    network.fromJSON(JSON.parse(data));
                    resolve('/disLike readPromise Success');
                }
            });
        }).then(() => {
            //Update Info
            network.train({input: audioInfo, output: 0});

            // Write back to file
            fs.writeFile('./data/neural-network.txt', JSON.stringify(network), (err) => {
                if (err) {
                    console.log("/dislike Darn");
                } 
                console.log("/dislike Neural Network Saved To File");
            });
        });
    } else {
        // Create Network
        network.train({input: audioInfo, output: 0});
        fs.writeFile('./data/neural-network.txt', JSON.stringify(network), (err) => {
            if (err) {
                console.log("/dislike Darn");
            } 
            console.log("/dislike Neural Network Saved To File");
        });
    } 
});

/*
 * App Listening
 */ 
app.listen(port, () => {
    // Log Server started
    console.log("Express started!");
});