//const express = require('express'); // Basic Library for web app
//const path = require('path'); // Library for path transformation 
//const http = require('http'); // Library for HTTP server
//const { MongoClient } = require('mongodb');
//const Redis = require('ioredis');

import express from 'express'; // Basic Library for web app
import { MongoClient } from 'mongodb';
import path from 'path'; // Library for path transformation 
import http from 'http'; // Library for HTTP server
import Redis from 'ioredis'; // Redis client
import { fileURLToPath } from 'url'; // From change to "const __dirname = path.dirname(new URL(import.meta.url).pathname);"

const app = express();

// Create an HTTP server using express
const server = http.createServer(app);

// Define the port to open the client
const port = process.env.PORT || 3000;

// Start the server, Glitch Terminal will show this log
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

//  Initializes parsing of JSON requests
app.use(express.json()); 

const __dirname = path.dirname(fileURLToPath(import.meta.url)); //Changed from "const __dirname = path.dirname(new URL(import.meta.url).pathname);"

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/userInformation.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "userInformation.html"));
});

// Sends files from the "public" directory to the client
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection URI and Database Name
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'SkyFare';

const client = new MongoClient(uri);

// Connect to the local Redis server (default port is 6379)
const redis = new Redis({
  host: '127.0.0.1', // Localhost
  port: 6379,         // Default Redis port
  db: 0               // Redis database index (default is 0)
});

// Test the connection
redis.on('connect', () => {
  console.log('Connected to Redis!');
});

redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

app.get('/one', async(req, res) => {
  try {
    const distinctAirports = await getDistinctAirports();
    //console.log("Server:")
    //console.log(distinctAirports);
    res.json({ distinctAirports });
  } 
  catch (error) {
    console.error('Error in /test route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/two', async(req, res) => {
  const { originAirport } = req.body;

  if (!originAirport ) {
    return res.status(400).send('Origin not received on Server');
  }

  console.log("Received on Server: " + originAirport);

  try {
    const { maxFare, minFare, maxMiles, minMiles } = await priceRangeAndDistance(originAirport); // Replace with query two function
    //console.log("Server:") 
    //console.log({ maxFare, minFare, maxMiles, minMiles });
    res.json({ maxFare, minFare, maxMiles, minMiles });
  } 
  catch (error) {
    console.error('Error in /two route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/three', async(req, res) => {
  const { originAirport } = req.body;

  if (!originAirport ) {
    return res.status(400).send('Origin not received on Server');
  }

  //console.log("Received on Server: " + originAirport);

  try {
    const routesFromOrigin = await destRoutesFromOrigin(originAirport);
    //console.log("Server:")
    //console.log(routesFromOrigin);
    res.json({ routesFromOrigin });
  } 
  catch (error) {
    console.error('Error in /three route:', error);
    res.status(500).send('Internal Server Error');
  }
});

/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

// Async function to connect and run a distinct query
async function getDistinctAirports() {
  var distinctAirports;
  try {
    // Connect to the MongoDB client
    await client.connect();
    console.log('Connected to MongoDB');

    // Check if db is properly initialized
    const db = client.db(dbName);
    if (!db) {
      throw new Error('Failed to initialize the database');
    }

    // Access the collection
    const collection = db.collection('flightroutes');
    if (!collection) {
      throw new Error('Collection "flightroutes" does not exist');
    }

    // Run the distinct query
    distinctAirports = await collection.distinct('origin.airport');
    //console.log('Distinct airports:', distinctAirports);

  } 
  catch (err) {
    console.error('Error running the query:', err);
  } 
  finally {
    await client.close();
  }
  return distinctAirports;
}

async function priceRangeAndDistance(originAirport) {
  let result = {};
  var maxFare;
  var minFare;
  var maxMiles;
  var minMiles;
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('flightroutes');

    // Run the aggregation query
    const aggregationPipeline = [
      { 
        $match: { "origin.airport": originAirport }  // Match the provided origin airport
      },
      {
        $addFields: {
          fares: [
            {
              $toDouble: {
                $ifNull: [
                  { 
                    $cond: {
                      if: { $or: [{ $eq: [{ $trim: { input: "$averageFare" } }, ""] }, { $eq: ["$averageFare", null] }] },
                      then: null,
                      else: "$averageFare"
                    }
                  },
                  null
                ]
              }
            },
            {
              $toDouble: {
                $ifNull: [
                  { 
                    $cond: {
                      if: { $or: [{ $eq: [{ $trim: { input: "$lowestCarrier.fare" } }, ""] }, { $eq: ["$lowestCarrier.fare", null] }] },
                      then: null,
                      else: "$lowestCarrier.fare"
                    }
                  },
                  null
                ]
              }
            },
            {
              $toDouble: {
                $ifNull: [
                  { 
                    $cond: {
                      if: { $or: [{ $eq: [{ $trim: { input: "$largestCarrier.fare" } }, ""] }, { $eq: ["$largestCarrier.fare", null] }] },
                      then: null,
                      else: "$largestCarrier.fare"
                    }
                  },
                  null
                ]
              }
            }
          ]
        }
      },
      {
        $unwind: "$fares"
      },
      {
        $group: {
          _id: "$origin.airport",  // Group by origin airport
          maxFare: { $max: "$fares" },
          minFare: { $min: "$fares" },
          maxMiles: { $max: "$nsmiles" },
          minMiles: { $min: "$nsmiles" }
        }
      },
      {
        $project: {
          _id: 0,
          originAirport: "$_id",
          priceRange: {
            maxFare: "$maxFare",
            minFare: "$minFare"
          },
          distanceOptions: {
            maxMiles: "$maxMiles",
            minMiles: "$minMiles"
          }
        }
      }
    ];

    const queryResult = await collection.aggregate(aggregationPipeline).toArray();

    // Format the result for clarity
    if (queryResult.length > 0) {
      result = queryResult[0]; // Take the first (and only) result
      maxFare = result['priceRange']['maxFare'];
      minFare = result['priceRange']['minFare'];
      maxMiles = result['distanceOptions']['maxMiles'];
      minMiles = result['distanceOptions']['minMiles'];
    } 
    else {
      result = { message: "No data found for the specified origin airport." };
    }
  } 
  catch (error) {
    console.error('Error in priceRangeAndDistance:', error);
    throw error; // Propagate the error
  } 
  finally {
    await client.close();
  }

  return { maxFare, minFare, maxMiles, minMiles };
}

async function destRoutesFromOrigin(originAirport) {
  let routes = [];
  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection('flightroutes');

    // Run the aggregation query
    const result = await collection.aggregate([
      { 
        $match: { "origin.airport": originAirport }  // Replace "CVG" with the origin airport you are searching for
      },
      { 
        $group: {
          _id: null,  // We don't need to group by any specific field
          destinations: { $addToSet: "$destination.airport" }  // Adds unique destination airports to the array
        }
      },
      { 
        $project: { 
          _id: 0,  // Exclude the _id field
          destinations: { $sortArray: { input: "$destinations", sortBy: 1 } }  // Sort the destinations array alphabetically
        }
      }
    ]).toArray();

    // Extract destinations from the aggregation result
    if (result.length > 0) {
      routes = result[0].destinations;
    }

    //console.log(routes);
  } 
  catch (error) {
    console.error('Error in destRoutesFromOrigin:', error);
  } 
  finally {
    await client.close();
  }

  return routes; // Return the array of destinations
}
