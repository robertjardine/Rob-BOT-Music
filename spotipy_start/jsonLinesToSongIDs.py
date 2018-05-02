import json

with open('topSongsJSONTimeout.txt','r') as f, open('songIDListTimeout.txt','w',errors='replace') as g: 
    for x in f:
        x = x.rstrip()
        if not x: continue
        jsonLoader = json.loads(x)
        if 'tracks' in jsonLoader:
            for thisElement in jsonLoader['tracks']:
                g.write(thisElement['id'])
                g.write('\n')