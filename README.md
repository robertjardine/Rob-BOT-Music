# Rob-BOT-Music
    1. Use the public Spotify API to allow dynamic playlists to be created for a user. 
    2. Also allow users to listen to the same song within a room.

# Refined Goals / Features to Implement
1. Discover section with random playlist generation

2. Group room with sockets
    1. First step is random song playback
    2. Allow each user to pause, skip or replay a song for the room
   
# Stretch Goals
1. Create and train network
2. Use favorited and related artists' top songs to generate a suggested playlist

# Local Setup
1. Run `npm install`
2. In the Web App directory, create a file named '.env'
    1. Add CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, and PORT with values
    2. The id and secret are recieved when you have created a Spotify Developer account.
3. Run `node index.js`
4. The app will be running on localhost:3000