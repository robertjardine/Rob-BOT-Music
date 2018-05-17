import json
import lyricwikia
import random

# https://github.com/enricobacis/lyricwikia

thisLineJSON = {}

with open('topSongsJSONTimeout.txt','r') as f, open('lyricData.txt','w',errors='replace') as g: 
    for x in f:
        x = x.rstrip()
        if not x: continue
        jsonLoader = json.loads(x)
        if 'tracks' in jsonLoader:
            for thisElement in jsonLoader['tracks']:
                thisLineJSON['songName'] = thisElement['name']
                thisLineJSON['songID'] = thisElement['id']
                thisLineJSON['duration'] = thisElement['duration_ms']
                for thisArtist in thisElement['album']['artists']:
                    artistName = thisArtist['name']
                    songName = thisElement['name']
                    try:
                        lyrics = lyricwikia.get_lyrics(artistName,songName,linesep='\n',timeout=None)
                    except:
                        print('lyric error: not found for ' + songName + ' by ' + artistName)
                        lyrics = ""
                    thisLineJSON['lyrics'] = lyrics
                    thisLineJSON['artistName'] = thisArtist['name']
                    thisLineJSON['artistID'] = thisArtist['id']
                g.write(json.dumps(thisLineJSON))
                g.write('\n')
