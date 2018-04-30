import json


inputFile = open("outputs/output.txt","r",encoding="UTF-8")
outputFile = open("formattedJSON.txt","w")
inString = inputFile.read().split("^")
inString = inString[:-1]
for thisRequest in inString:
	jsonLoader = json.loads(thisRequest)
	outputFile.write(json.dumps(jsonLoader))
	outputFile.write("\n")
#print(jsonLoader)