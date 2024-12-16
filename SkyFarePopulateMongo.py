from pymongo import MongoClient
import redis
import re  # regular expressions
import json

# MongoDB configuration
mongoDBDatabase = 'SkyFare'
mongoCollection = 'flightroutes'
mongoUrl = "mongodb://localhost:27017/SkyFare"

# Redis clients for reading (DB 0) and writing (DB 1)
redisReader = redis.Redis(port=6379, db=0, decode_responses=True)  # For reading from DB 0
redisWriter = redis.Redis(port=6379, db=1, decode_responses=True)  # For writing to DB 1

# The size of document upload batches
batchSize = 50

# Function to ensure the database and collection are reset
def initializeDatabase():
    with MongoClient(mongoUrl) as client:
        if mongoDBDatabase in client.list_database_names():
            print(f"Database '{mongoDBDatabase}' exists. Dropping it.")
            client.drop_database(mongoDBDatabase)
        
        print(f"Creating database '{mongoDBDatabase}' and collection '{mongoCollection}'.")
        db = client[mongoDBDatabase]
        db.create_collection(mongoCollection)

# Helper function to insert documents into MongoDB in bulk
def saveDocs(documents, count):
    with MongoClient(mongoUrl) as client:
        dbo = client[mongoDBDatabase]
        for doc in documents:
            dbo[mongoCollection].update_one(
                {"_id": doc["_id"]},  # Match based on _id
                {"$set": doc},        # Update document with new values
                upsert=True           # Insert if not already present
            )
        print(f"Number of documents processed: {len(documents)}")

# Function to store unique airport data in Redis database 1
def storeAirportInRedis(airport, latitude, longitude):
    if not latitude or not longitude:  # Skip if latitude or longitude is empty
        return

    redisKey = f"airport:{airport}"
    if not redisWriter.exists(redisKey):  # Avoid overwriting existing data
        redisWriter.hset(redisKey, mapping={
            "latitude": latitude,
            "longitude": longitude
        })

# Main function to process routes and populate MongoDB
def populateRoutes():
    readRoutes = 0
    routeBatch = []

    for flightKey in redisReader.keys('flight:*'):  # Read from DB 0
        flightID = flightKey[7:28]

        year = redisReader.hget("flight:" + flightID + ":info", "year")
        quarter = redisReader.hget("flight:" + flightID + ":info", "quarter")
        averageFare = redisReader.hget("flight:" + flightID + ":info", "averageFare")
        nsmiles = redisReader.hget("flight:" + flightID + ":info", "nsmiles")

        # Process origin data
        originAirport = redisReader.hget("flight:" + flightID + ":origin", "airport")
        originCity = redisReader.hget("flight:" + flightID + ":origin", "city")
        originGeocode = redisReader.hget("flight:" + flightID + ":origin", "geocode")
        if originGeocode and "\n" in originGeocode:
            originLat, originLon = originGeocode.split("\n")[1].strip("()").split(", ")
            storeAirportInRedis(originAirport, originLat, originLon)

        # Process destination data
        destinationAirport = redisReader.hget("flight:" + flightID + ":destination", "airport")
        destinationCity = redisReader.hget("flight:" + flightID + ":destination", "city")
        destinationGeocode = redisReader.hget("flight:" + flightID + ":destination", "geocode")
        if destinationGeocode and "\n" in destinationGeocode:
            destinationLat, destinationLon = destinationGeocode.split("\n")[1].strip("()").split(", ")
            storeAirportInRedis(destinationAirport, destinationLat, destinationLon)

        # Append to route batch
        routeBatch.append({
            "_id": flightID,
            "year": year,
            "quarter": quarter,
            "origin": {
                "airport": originAirport,
                "city": originCity
            },
            "destination": {
                "airport": destinationAirport,
                "city": destinationCity
            },
            "largestCarrier": {
                "name": redisReader.hget("flight:" + flightID + ":largestCarrier", "name"),
                "fare": redisReader.hget("flight:" + flightID + ":largestCarrier", "fare")
            },
            "lowestCarrier": {
                "name": redisReader.hget("flight:" + flightID + ":lowestCarrier", "name"),
                "fare": redisReader.hget("flight:" + flightID + ":lowestCarrier", "fare")
            },
            "averageFare": averageFare,
            "nsmiles": nsmiles
        })

        readRoutes += 1
        if len(routeBatch) >= batchSize:
            saveDocs(routeBatch, len(routeBatch))
            routeBatch = []
        if readRoutes % 100 == 0:
            print('Routes Loaded: ' + str(readRoutes))

    if len(routeBatch) > 0:
        saveDocs(routeBatch, len(routeBatch))

    print('Routes Loaded: ' + str(readRoutes))


initializeDatabase()

populateRoutes()

with MongoClient(mongoUrl) as client:
    dbo = client[mongoDBDatabase]
    dbo[mongoCollection].create_index({"origin.airport": "text", "destination.airport": "text"})
    print("Text index created on 'origin.airport' and 'destination.airport'.")

# Close Redis connections
redisReader.quit()
redisWriter.quit()
