import json

with open('timeoutSearch.txt','r') as f, open('artistIDList.txt','w',errors='replace') as g: 
    for x in f:
        x = x.rstrip()
        if not x: continue
        jsonLoader = json.loads(x)
        if 'artists' in jsonLoader:
            for thisElement in jsonLoader['artists']['items']:
                g.write(thisElement['id'])
                g.write('\n')