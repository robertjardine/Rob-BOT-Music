import json

with open('formattedJSONTopSongs.txt','r') as f, open('songIDList.txt','w',errors='replace') as g: 
    for x in f:
        x = x.rstrip()
        if not x: continue
        jsonLoader = json.loads(x)
        if 'tracks' in jsonLoader:
            for thisElement in jsonLoader['tracks']:
                g.write(thisElement['id'])
                g.write('\n')