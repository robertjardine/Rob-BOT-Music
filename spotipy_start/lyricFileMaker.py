import json
import tswift
import random

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
                    artistObject = tswift.Artist(thisArtist['name'])
                    print(artistObject.songs)
                    #thisLineJSON['lyrics'] = tswift.Song(thisArtist['name'],thisElement['name']).format()
                    thisLineJSON['artistName'] = thisArtist['name']
                    thisLineJSON['artistID'] = thisArtist['id']
                g.write(json.dumps(thisLineJSON))
                g.write('\n')
        break