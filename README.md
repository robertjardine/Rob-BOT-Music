# Rob-BOT-Music
    1. Use the public Spotify API to allow dynamic playlists to be created for a user. 
    2. Also allow users to listen to the same song within a room.

# Refined Goals / Features to Implement
- [x] 1. Discover section with random playlist generation

- [ ] 2. Group room with sockets
    1. First step is random song playback
    2. Allow each user to pause, skip or replay a song for the room
   
# Stretch Goals
- [ ] 1. Create and train network
- [ ] 2. Use favorited and related artists' top songs to generate a suggested playlist

# Local Setup
1. Run `npm install`
2. In the Web App directory, create a file named '.env'
    1. Add CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, and PORT with values
    2. The id and secret are recieved when you have created a Spotify Developer account.
3. Run `node index.js`
4. The app will be running on localhost with whatever value was set for PORT

# Spotify Endpoints
`https://api.spotify.com/v1/me/tracks`
`https://api.spotify.com/v1/artists/${artistId}`
`https://api.spotify.com/v1/artists/${artistId}/related-artists`
`https://api.spotify.com/v1/artist/${artistId}/top-songs`
`https://api.spotify.com/v1/tracks/audio-features/${trackId}`

# Brain.js
```
network.run({
    input: {
        acousticness: audioInfo.acousticness,
        danceability: audioInfo.danceability,
        energy: audioInfo.energy,
        instrumentalness: audioInfo.instrumentalness,
        liveness: audioInfo.liveness,
        speechiness: audioInfo.speechiness,
        valence: audioInfo.valence,
        loudness: audioInfo.loudness,
        key: audioInfo.key,
        duration_ms: audioInfo.duration_ms
    }
});
```
`LOUDNESS_LOW: -60`
`LOUDNESS_HIGH: 0`
`DURATION_MS_HIGH: 420000`
`DURATION_MS_LOW: 0`
`KEY_HIGH: 11`
`KEY_LOW: 0`
