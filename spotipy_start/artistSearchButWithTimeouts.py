import os
import spotipy
import spotipy.util as util
import json
from time import sleep
from spotipy.oauth2 import SpotifyClientCredentials

client_credentials_manager = SpotifyClientCredentials(client_id="19a5e88685af46759ece15d390334bd5", client_secret="25e0127d9eb9466aa7d4e7f92176a535")

spotify = spotipy.Spotify(client_credentials_manager=client_credentials_manager,requests_timeout=10)
alphabet = 'abcdefghijklmnopqrstuvwxyz'
results = ''

fileOut = open("timeoutSearch.txt","w")
for i in range(2000):
	sleep(0.1)
	print(i)
	for letter in alphabet:
		results = spotify.search(q='artist:'+letter, type='artist',limit=50,offset=50*i)
		fileOut.write(json.dumps(results))
		fileOut.write("\n")