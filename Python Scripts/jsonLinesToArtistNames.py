import json

with open('formattedJSON.txt','r') as f, open('artistList.txt','w',errors='replace') as g: 
    for x in f:
        x = x.rstrip()
        if not x: continue
        jsonLoader = json.loads(x)
        for thisElement in jsonLoader['artists']['items']:
            g.write(thisElement['name'])
            g.write('\n')