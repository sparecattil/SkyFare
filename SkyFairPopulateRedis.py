import redis
import csv
import json
# Redis client
redisClient = redis.Redis(port=6379)
# The CSV file containing the pokemon data
csvFilename = "US Airline Flight Routes and Fares 1993-2024.csv"
# Track how many file lines we've processed
processedLines = 0
## This function loops through the
## CSV data file and populates Redis
def populateRedis():
    line_count = 0
    with open(csvFilename, encoding="utf8") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for data in csv_reader:
            #year = data['Year']
            #quarter = data['quarter']
            #cityOne = data['city1']
            #cityTwo = data['city2']
            #airportOne = data['airport_1']
            #airportTwo = data['airport2']
            #nsmiles = data['nsmiles']
            #averageFare = data['fare']
            #largestCarrier = data['carrier_lg']
            #largestFare = data['fare_lg']
            #lowestCarrier = data['carrier_low']
            #lowestFare = data['fare_low']
            #geocodeOne = data['Geocoded_City1']
            #geocodeTwo = data['Geocoded_City2']
            """
            info = {
                "year": data['Year'],
                "quarter": data['quarter'],
                "averageFare": data['fare'],
                "nsmiles": data['nsmiles']
            }

            origin = {
                "airport": data['airport_1'],
                "city": data['city1'],
                "geocode": data['Geocoded_City1']
            }

            destination = {
                "airport": data['airport_2'],
                "city": data['city2'],
                "geocode": data['Geocoded_City2']
            }

            largestCarrier = {
                "name": data['carrier_lg'],
                "fare": data['fare_lg']
            }

            lowestCarrier = {
                "name": data['carrier_low'],
                "fare": data['fare_low']
            }

            """
            line_count += 1
            if line_count%100 == 0:
                print(f'Processed {line_count} lines.')

            flightID = data['tbl1apk']

            redisClient.hmset(f"flight:{flightID}:info", {
                "year": data['Year'],
                "quarter": data['quarter'],
                "averageFare": data['fare'],
                "nsmiles": data['nsmiles']
            })

            redisClient.hmset(f"flight:{flightID}:origin", {
                "airport": data['airport_1'],
                "city": data['city1'],
                "geocode": data['Geocoded_City1']
            })

            redisClient.hmset(f"flight:{flightID}:destination", {
                "airport": data['airport_2'],
                "city": data['city2'],
                "geocode": data['Geocoded_City2']
            })

            redisClient.hmset(f"flight:{flightID}:largestCarrier", {
                "name": data['carrier_lg'],
                "fare": data['fare_lg']
            })

            redisClient.hmset(f"flight:{flightID}:lowestCarrier", {
                "name": data['carrier_low'],
                "fare": data['fare_low']
            })

    print(f'Processed {line_count} lines.')

populateRedis()
redisClient.quit()