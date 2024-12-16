####################################################################
# Contributors: Sebastian Parecattil, Shiv Patel
# Versions: Python - 3.12.6
####################################################################

import redis
import csv

# Initialize a Redis client instance, connecting to Redis server on port 6379
redisClient = redis.Redis(port=6379)

# The CSV file containing airline flight route and fare data
csvFilename = "US Airline Flight Routes and Fares 1993-2024.csv"

# Counter to keep track of how many lines have been processed
processedLines = 0

# Function to populate Redis database with flight data from the CSV file
def populateRedis():
    redisClient.flushdb() # Clearing all existing data from the Redis database

    line_count = 0 # Counter to track the number of lines processed in the current session

    # Opening the CSV file in read mode with UTF-8 encoding
    with open(csvFilename, encoding="utf8") as csv_file:
        csv_reader = csv.DictReader(csv_file) # Creating a CSV reader object to parse the file

        # Looping through each row of data in the CSV file
        for data in csv_reader:
            flightID = data['tbl1apk'] # Extracting the unique flight ID

            # Storing general flight information
            redisClient.hset(f"flight:{flightID}:info", mapping={
                "year": data['Year'],        # Year of the flight
                "quarter": data['quarter'],  # Quarter of the year
                "averageFare": data['fare'], # Average fare for the flight
                "nsmiles": data['nsmiles']   # Number of miles traveled
            })

            # Storing origin airport information
            redisClient.hset(f"flight:{flightID}:origin", mapping={
                "airport": data['airport_1'],     # Origin airport code
                "city": data['city1'],            # Origin city name
                "geocode": data['Geocoded_City1'] # Geocode for the origin city
            })

            # Storing destination airport information
            redisClient.hset(f"flight:{flightID}:destination", mapping={
                "airport": data['airport_2'],     # Destination airport code
                "city": data['city2'],            # Destination city name
                "geocode": data['Geocoded_City2'] # Geocode for the destination city
            })

            # Storing information about the largest fare carrier
            redisClient.hset(f"flight:{flightID}:largestCarrier", mapping={
                "name": data['carrier_lg'], # Name of the largest fare carrier
                "fare": data['fare_lg']     # Fare charged by the largest fare carrier
            })

            # Store information about the lowest fare carrier
            redisClient.hset(f"flight:{flightID}:lowestCarrier", mapping={
                "name": data['carrier_low'], # Name of the lowest fare carrier
                "fare": data['fare_low']     # Fare charged by the lowest fare carrier
            })

            line_count += 1
            if line_count % 100 == 0:
                print(f'Processed {line_count} lines.')

    print(f'Processed {line_count} lines.')

populateRedis()

redisClient.quit()