
from pymongo import MongoClient
import redis
import re #regular expressions
import json
#keep track of how many pokemon we have processed
processedpokemon = 0
#The name of the mongo database
mongoDBDatabase = 'SkyFare'
mongoCollection = 'flightroutes'
mongoUrl = "mongodb://localhost:27017/SkyFare"
#The size of document upload batches
batchSize = 50
#database clients
redisClient = redis.Redis(port=6379, decode_responses=True)
## A helper function that builds a good mongoDB key
## @param string the unicode string being keyified
## Insert documents into mongoDB in bulk.
## @param documents The documents to store
## @param count The number of documents being inserted.
def saveDocs(documents, count):
    with MongoClient(mongoUrl) as client:
        dbo = client[mongoDBDatabase]
        for doc in documents:
            dbo[mongoCollection].update_one(
                {"_id": doc["_id"]},  
                {"$set": doc},       
                upsert=True           
            )
            print(f"Number of documents processed: {len(documents)}")


def populateRoutes():
    readRoutes = 0
    routeBatch = []
    for flightKey in redisClient.keys('flight:*'):
        flightID = flightKey[7:28]

        year = redisClient.hget("flight:" + flightID + ":info", "year")
        quarter = redisClient.hget("flight:" + flightID + ":info", "quarter")
        averageFare = redisClient.hget("flight:" + flightID + ":info", "averageFare")
        nsmiles = redisClient.hget("flight:" + flightID + ":info", "nsmiles")

        originAirport = redisClient.hget("flight:" + flightID + ":origin", "airport")
        originCity = redisClient.hget("flight:" + flightID + ":origin", "city")
        originGeocode = redisClient.hget("flight:" + flightID + ":origin", "geocode")
        print(originGeocode +"----")
        originLat = ""
        originLon = ""
        if (originGeocode != "" and "\n" in originGeocode):
            originLat, originLon = originGeocode.split("\n")[1].strip("()").split(", ")
        else:
            print("skip orig")

        destinationAirport = redisClient.hget("flight:" + flightID + ":destination", "airport")
        destinationCity = redisClient.hget("flight:" + flightID + ":destination", "city")
        destinationGeocode = redisClient.hget("flight:" + flightID + ":destination", "geocode")
        destinationLat = ""
        destinationLon = ""
        if (destinationGeocode != "" and "\n" in destinationGeocode):
            destinationLat, destinationLon = destinationGeocode.split("\n")[1].strip("()").split(", ")
        else:
            print("skip dest")

        largestCarrierName = redisClient.hget("flight:" + flightID + ":largestCarrier", "name")
        largestCarrierFare = redisClient.hget("flight:" + flightID + ":largestCarrier", "fare")

        lowestCarrierName = redisClient.hget("flight:" + flightID + ":lowestCarrier", "name")
        lowestCarrierFare = redisClient.hget("flight:" + flightID + ":lowestCarrier", "fare")

        routeBatch.append({
            "_id": flightID,
            "year": year,
            "quarter": quarter,
            "origin": {
                "airport": originAirport,
                "city": originCity,
                "latitude": originLat,
                "longitude": originLon
            },
            "destination": {
                "airport": destinationAirport,
                "city": destinationCity,
                "latitude": destinationLat,
                "longitude": destinationLon
            },
            "largestCarrier": {
                "name": largestCarrierName,
                "fare": largestCarrierFare
            },
            "lowestCarrier": {
                "name": lowestCarrierName,
                "fare": lowestCarrierFare
            },
            "averageFare": averageFare,
            "nsmiles": nsmiles
        })

        readRoutes += 1
        if (len(routeBatch) >= batchSize):
            saveDocs(routeBatch, len(routeBatch))
            routeBatch = []
        if (readRoutes % 100 == 0):
            print ('Routes Loaded: ' + str(readRoutes))
    if (len(routeBatch) > 0):
        saveDocs(routeBatch, len(routeBatch))
    print ('Routes Loaded: ' + str(readRoutes))

populateRoutes()
redisClient.quit()
