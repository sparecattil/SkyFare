####################################################################
# Contributors: Sebastian Parecattil, Shiv Patel
# Versions: Python - 3.12.6
####################################################################

from pymongo import MongoClient
import redis

# MongoDB configuration
mongoDBDatabase = 'SkyFare' # Name of the MongoDB database
mongoCollection = 'flightroutes' # Name of the MongoDB collection
mongoUrl = "mongodb://localhost:27017/SkyFare" # MongoDB connection URL

# Redis clients for reading (DB 0) and writing (DB 1)
redisReader = redis.Redis(port=6379, db=0, decode_responses=True)  # Reading from Redis DB 0
redisWriter = redis.Redis(port=6379, db=1, decode_responses=True)  # Writing to Redis DB 1

# The size of document upload batches
batchSize = 50

# Function to ensure the MongoDB database and collection are reset
def initializeDatabase():
    with MongoClient(mongoUrl) as client:
        # Checking if the database already exists
        if mongoDBDatabase in client.list_database_names():
            print(f"Database '{mongoDBDatabase}' exists. Dropping it.")
            client.drop_database(mongoDBDatabase) # Dropping existing database to reset data
        
        print(f"Creating database '{mongoDBDatabase}' and collection '{mongoCollection}'.")
        db = client[mongoDBDatabase]
        db.create_collection(mongoCollection) # Create the new collection

# Function to insert documents into MongoDB in bulk
def saveDocs(documents, count):
    with MongoClient(mongoUrl) as client:
        dbo = client[mongoDBDatabase]
        for doc in documents:
            # Inserting or updating documents in the collection
            dbo[mongoCollection].update_one(
                {"_id": doc["_id"]}, # Match based on _id
                {"$set": doc},       # Update document with new values
                upsert=True          # Insert if not already present
            )
        print(f"Number of documents processed: {len(documents)}")

# Function to store an airport's latitudes and longitudes in Redis DB 1
def storeAirportInRedis(airport, latitude, longitude):
    if not latitude or not longitude:  # Skip if latitude or longitude is empty
        return

    redisKey = f"airport:{airport}" # Key format for airports
    if not redisWriter.exists(redisKey):  # Avoid overwriting existing data
        redisWriter.hset(redisKey, mapping={
            "latitude": latitude,
            "longitude": longitude
        })

# Function to process routes and populate MongoDB
# Also writes the latitudes and longitude of the origins and destinations to Redis DB 1 
def populateRoutes():
    readRoutes = 0 # Counter for the number of routes read
    routeBatch = [] # Batch of routes to be uploaded to MongoDB

    # Reading flight data keys from Redis DB 0
    for flightKey in redisReader.keys('flight:*'):
        flightID = flightKey[7:28] # Extracting the unique flight ID from the key

        # Fetching general flight information from Redis
        year = redisReader.hget("flight:" + flightID + ":info", "year")
        quarter = redisReader.hget("flight:" + flightID + ":info", "quarter")
        averageFare = redisReader.hget("flight:" + flightID + ":info", "averageFare")
        nsmiles = redisReader.hget("flight:" + flightID + ":info", "nsmiles")

        # Process origin airport information
        originAirport = redisReader.hget("flight:" + flightID + ":origin", "airport")
        originCity = redisReader.hget("flight:" + flightID + ":origin", "city")
        originGeocode = redisReader.hget("flight:" + flightID + ":origin", "geocode")
        if originGeocode and "\n" in originGeocode:
            # Extracting latitude and longitude from geocode
            originLat, originLon = originGeocode.split("\n")[1].strip("()").split(", ")
            storeAirportInRedis(originAirport, originLat, originLon) # Storing an origin airport's lat/lon in Redis DB 1

        # Process destination airport information
        destinationAirport = redisReader.hget("flight:" + flightID + ":destination", "airport")
        destinationCity = redisReader.hget("flight:" + flightID + ":destination", "city")
        destinationGeocode = redisReader.hget("flight:" + flightID + ":destination", "geocode")
        if destinationGeocode and "\n" in destinationGeocode:
            # Extracting latitude and longitude from geocode
            destinationLat, destinationLon = destinationGeocode.split("\n")[1].strip("()").split(", ")
            storeAirportInRedis(destinationAirport, destinationLat, destinationLon) # Storing an destination airport's lat/lon in Redis DB 1

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

        # Saving batch to MongoDB if batch size is reached
        if len(routeBatch) >= batchSize:
            saveDocs(routeBatch, len(routeBatch))
            routeBatch = []

        if readRoutes % 100 == 0:
            print('Routes Loaded: ' + str(readRoutes))

    # Saving remaining routes in the final batch
    if len(routeBatch) > 0:
        saveDocs(routeBatch, len(routeBatch))

    print('Routes Loaded: ' + str(readRoutes))


initializeDatabase()

populateRoutes()

# Creating a text index on origin and destination airport fields in MongoDB
with MongoClient(mongoUrl) as client:
    dbo = client[mongoDBDatabase]
    dbo[mongoCollection].create_index({"origin.airport": "text", "destination.airport": "text"})
    print("Text index created on 'origin.airport' and 'destination.airport'.")

redisReader.quit()
redisWriter.quit()
