import os
import spotipy
import spotipy.util as util
import json
from time import sleep
from spotipy.oauth2 import SpotifyClientCredentials
#NOTE: THIS TAKES WAY TOO LONG TO RUN ON LARGE DATA SETS - 2 SONGS PER SECOND
#Consider using alternative call (audio_features instead of audio_analysis?) for quicker results
client_credentials_manager = SpotifyClientCredentials(client_id="19a5e88685af46759ece15d390334bd5", client_secret="25e0127d9eb9466aa7d4e7f92176a535")

spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager,requests_timeout=10)
results = ''
fileOut = open("audioInfo2.txt","w")

with open("songIDListTimeout2.txt","r",encoding="UTF-8") as fileIn:
	for line in fileIn:
		line = line.strip("\n")
		print(line)
		try:
			results = spotify.audio_analysis(line)
		except:
			print("Error, skipping and continuing")
		fileOut.write(json.dumps(results))
		fileOut.write("\n")