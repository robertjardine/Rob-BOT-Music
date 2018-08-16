# Rob-BOT-Music
1. Use the public Spotify API to allow dynamic playlists to be created for a user. 
2. Also allow users to listen to the same song within a room.

# Refined Goals / Features to Implement :
1. Get users favorited songs
   1. Create and train network
2. Use favorited and related artists' top songs to generate a suggested playlist

3. Discover section with random playlist generation
   1. Allow filters to be added for the random generation (i.e. genre, etc.)

4. Group room with sockets
   1. Begin by reading each user's favorites to generate
   2. Allow each user to pause, skip or replay a song for the room

# Local Setup
1. In the Web App directory, create a file named '.env'
   1. Add CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, and PORT with values
