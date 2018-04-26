import json

with open('formattedJSON.txt','r') as f, open('artistList.txt','w') as g: 
	for x in f:
		x = x.rstrip()
		if not x: continue
		jsonLoader = json.loads(x)
		for thisElement in jsonLoader['artists']['items']:
			for eachThing in thisElement:
				if "name" in eachThing:
					print(eachThing)
					print("\n")
				#print(eachThing)
				#print("\n")
			#listThis = thisElement.split(",")
			#for maybeName in thisList:
			#	
		#g.write(json.dumps(jsonLoader))
		#g.write