import redis
import csv

# Redis client
redisClient = redis.Redis(port=6379)
# The CSV file containing the pokemon data
csvFilename = "US Airline Flight Routes and Fares 1993-2024.csv"
# Track how many file lines we've processed
processedLines = 0
## This function loops through the
## CSV data file and populates Redis
def populateRedis():
    redisClient.flushdb()
    line_count = 0
    with open(csvFilename, encoding="utf8") as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for data in csv_reader:
            flightID = data['tbl1apk']

            redisClient.hset(f"flight:{flightID}:info", mapping={
                "year": data['Year'],
                "quarter": data['quarter'],
                "averageFare": data['fare'],
                "nsmiles": data['nsmiles']
            })

            redisClient.hset(f"flight:{flightID}:origin", mapping={
                "airport": data['airport_1'],
                "city": data['city1'],
                "geocode": data['Geocoded_City1']
            })

            redisClient.hset(f"flight:{flightID}:destination", mapping={
                "airport": data['airport_2'],
                "city": data['city2'],
                "geocode": data['Geocoded_City2']
            })

            redisClient.hset(f"flight:{flightID}:largestCarrier", mapping={
                "name": data['carrier_lg'],
                "fare": data['fare_lg']
            })

            redisClient.hset(f"flight:{flightID}:lowestCarrier", mapping={
                "name": data['carrier_low'],
                "fare": data['fare_low']
            })

            line_count += 1
            if line_count%100 == 0:
                print(f'Processed {line_count} lines.')

    print(f'Processed {line_count} lines.')

populateRedis()
redisClient.quit()