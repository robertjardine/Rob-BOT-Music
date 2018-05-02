import os
import spotipy
import spotipy.util as util
import json
from time import sleep
from spotipy.oauth2 import SpotifyClientCredentials

client_credentials_manager = SpotifyClientCredentials(client_id="19a5e88685af46759ece15d390334bd5", client_secret="25e0127d9eb9466aa7d4e7f92176a535")

spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager,requests_timeout=10)
results = ''
fileOut = open("audioFeatures.txt","w")
idList = []
# Audio features takes a list of song IDs and returns their features
# Spotipy says it maxes at 50 IDs, but Spotify's API claims you can use 100 at a time
with open("songIDList.txt","r",encoding="UTF-8") as fileIn:
	for line in fileIn:
		line = line.strip("\n")
		print(line)
		idList.append(line)
		if( len(idList) >= 50 ):
			results = spotify.audio_features(idList)
			fileOut.write(json.dumps(results))
			fileOut.write("\n")
			idList.clear()