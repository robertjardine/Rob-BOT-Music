import os
import spotipy
import spotipy.util as util
import json
from time import sleep
from spotipy.oauth2 import SpotifyClientCredentials

client_credentials_manager = SpotifyClientCredentials(client_id="19a5e88685af46759ece15d390334bd5", client_secret="25e0127d9eb9466aa7d4e7f92176a535")

spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager)
results = ''
fileOut = open("topSongsJSON.txt","w")

with open("artistIDList.txt","r",encoding="UTF-8") as fileIn:
	for line in fileIn:
		line = line.strip("\n")
		#print(line)
		results = spotify.artist_top_tracks(artist_id=line,country='US')
		fileOut.write(json.dumps(results))
		fileOut.write("\n")