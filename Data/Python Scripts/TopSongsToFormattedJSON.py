import json


inputFile = open("outputs/topSongs.txt","r",encoding="UTF-8")
outputFile = open("formattedJSONTopSongs.txt","w")
inString = inputFile.read().split("^")
inString = inString[:-1]
for thisRequest in inString:
	jsonLoader = json.loads(thisRequest)
	outputFile.write(json.dumps(jsonLoader))
	outputFile.write("\n")
#print(jsonLoader)