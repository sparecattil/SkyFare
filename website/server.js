//////////////////////////////////////////////////////////////////////////////////////////////
// Contributors: Sebastian Parecattil, Shiv Patel
// Versions: Node - 23.3.0
//
//////////////////////////////////////////////////////////////////////////////////////////////
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
  db: 1               // Redis database index (default is 0)
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

  //console.log("Received on Server: " + originAirport);

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


app.post('/four', async(req, res) => {
  const { originAirport, destinationAirport } = req.body;

  if (!originAirport || !destinationAirport ) {
    return res.status(400).send('Origin and destination not received on Server');
  }


  try {
    const graphData = await getGraphData(originAirport, destinationAirport);
    res.json({ graphData });
  } 
  catch (error) {
    console.error('Error in /three route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/five', async(req, res) => {
  try {
    const recommendations = await getUserRecommendations();
    //console.log("Server:")
    //console.log(distinctAirports);
    res.json({ recommendations });
  } 
  catch (error) {
    console.error('Error in /test route:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/seven', async(req, res) => {
  const { originAirport, destinationAirport } = req.body;

  if (!originAirport || !destinationAirport ) {
    return res.status(400).send('Origin and destination not received on Server');
  }

  try {
    const { originLat, originLon, destLat, destLon } = await getLatLong(originAirport, destinationAirport);
    //console.log("Server:")
    //console.log(routesFromOrigin);
    res.json({ originLat, originLon, destLat, destLon });
  } 
  catch (error) {
    console.error('Error in /seven route:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/accounts', async(req, res) => {
  const { username, password } = req.body;

  if (!username || !password ) {
    return res.status(400).send('Username and password not received on Server');
  }

  try {
    const signInStatus = await signIn(username, password);
    res.json({ signInStatus });
  } 
  catch (error) {
    console.error('Error in /accounts route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/accountDetails', async(req, res) => {
  const { originAirport, price, miles } = req.body;

  if (!originAirport || !price || !miles) {
    return res.status(400).send('Origin, price range, miles not received on Server');
  }

  try {
    await setUserDetails(originAirport, price, miles);
  } 
  catch (error) {
    console.error('Error in /accountDetails route:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/userActive', async(req, res) => {
  try {
    const exists = await checkUserExistence(lastUsername);
    //console.log("Server:")
    //console.log(distinctAirports);
    res.json({ exists });
  } 
  catch (error) {
    console.error('Error in /test route:', error);
    res.status(500).send('Internal Server Error');
  }
});


/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////

var lastUsername;

// Function to check if user still exists in Redis
async function checkUserExistence(lastUsername) {
  var exists;
  try {
    const redisKey = `user:${lastUsername}`;

    // Check if the key exists in Redis
    exists = await redis.exists(redisKey);

    if (!exists) {
      console.log(`User ${lastUsername} does not exist in Redis`);
    }
  } 
  catch (error) {
    console.error("Error checking user existence in Redis:", error);
    throw error;
  }
  return exists;
}

async function setUserDetails(originAirport, price, miles) {
  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB to update user details");

    // Access the database and the 'accounts' collection
    const db = client.db(dbName);
    const collection = db.collection("accounts");

    // Update the user document with the provided details
    const result = await collection.updateOne(
      { username: lastUsername }, // Filter: Match the username
      { 
        $set: {                   // Add or update fields
          originAirport: originAirport,
          price: price,
          miles: miles
        }
      }
    );

    // Check if the update was successful
    if (result.matchedCount === 0) {
      console.log("No account found for username:", lastUsername);
    }

    //console.log("User details updated successfully for:", lastUsername);

    const redisKey = `user:${lastUsername}`;

    await redis
      .multi() // Start a Redis transaction
      .hset(redisKey, { 
        originAirport: originAirport,
        price: price,
        miles: miles
      })
      .expire(redisKey, 300) // Set TTL to 5 minutes (300 seconds)
      .exec();

    console.log("User details stored in Redis with 5-minute TTL for:", lastUsername);

  } 
  catch (error) {
    console.error("Error updating user details:", error);
  } 
  finally {
    // Close the MongoDB connection
    if (client) await client.close();
  }
}


// Function to add or validate a user in 'accounts' collection
async function signIn(username, password) {
  lastUsername = username;
  let client;
  var signInStatus;
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection("accounts");

    // Ensure the 'accounts' collection exists
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const collectionNames = collections.map((col) => col.name);
    if (!collectionNames.includes("accounts")) {
      await db.createCollection("accounts");
      console.log("Collection 'accounts' has been created.");
      await collection.createIndex({ username: 1 }, { unique: true });
      console.log("Unique index on 'username' has been created.");
    }

    // Check if the user already exists
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      // User exists, validate the password
      if (existingUser.password === password) {
        console.log("Password matches for existing user:", username);
        signInStatus = true;
      } 
      else {
        console.log("Password does not match for user:", username);
        signInStatus = false;
      }
    } 
    else {
      // Insert the new user
      await collection.insertOne({ username, password });
      console.log("New user added:", username);
      signInStatus = true;
    }
  } 
  catch (error) {
    console.error("Error handling user account:", error);
    signInStatus = false;
  } 
  finally {
    // Close the connection
    if (client) await client.close();
  }

  //console.log(signInStatus);
  return signInStatus;
}

// async function test() {
//   var testStatus = await signIn("Shiv","123abc");
//   console.log("First " + testStatus);
//   testStatus = await signIn("Shiv","123aBc");
//   console.log("Second " + testStatus);
// }


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
        $match: { "origin.airport": originAirport }  // Replace "STL" with the desired origin airport
      },
      {
        $addFields: {
          fares: [
            {
              $toDouble: {
                $ifNull: [
                  { 
                    $cond: {
                      if: { 
                        $or: [
                          { $eq: [{ $trim: { input: "$averageFare" } }, ""] }, 
                          { $eq: ["$averageFare", null] }
                        ]
                      },
                      then: null,
                      else: "$averageFare"
                    }
                  },
                  null  // Default to null for invalid values
                ]
              }
            },
            {
              $toDouble: {
                $ifNull: [
                  { 
                    $cond: {
                      if: { 
                        $or: [
                          { $eq: [{ $trim: { input: "$lowestCarrier.fare" } }, ""] }, 
                          { $eq: ["$lowestCarrier.fare", null] }
                        ]
                      },
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
                      if: { 
                        $or: [
                          { $eq: [{ $trim: { input: "$largestCarrier.fare" } }, ""] }, 
                          { $eq: ["$largestCarrier.fare", null] }
                        ]
                      },
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
          maxMiles: { $max: { $toDouble: "$nsmiles" } },  // Ensure miles are treated as numbers
          minMiles: { $min: { $toDouble: "$nsmiles" } }
        }
      },
      {
        $addFields: {
          // Adjust miles only if maxMiles is smaller than minMiles
          maxMiles: {
            $cond: {
              if: { $lt: ["$maxMiles", "$minMiles"] },  // If maxMiles < minMiles
              then: "$minMiles",  // Swap the values
              else: "$maxMiles"
            }
          },
          minMiles: {
            $cond: {
              if: { $lt: ["$maxMiles", "$minMiles"] },  // If maxMiles < minMiles
              then: "$maxMiles",  // Swap the values
              else: "$minMiles"
            }
          }
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
            maxMiles: "$maxMiles",  // Use adjusted maxMiles
            minMiles: "$minMiles"   // Use adjusted minMiles
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

  //console.log({ maxFare, minFare, maxMiles, minMiles });
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

async function getLatLong(originAirport, destinationAirport) {
  let originLat, originLon, destLat, destLon;

  try {
    // Construct Redis keys for the origin and destination airports
    const originKey = `airport:${originAirport}`;
    const destinationKey = `airport:${destinationAirport}`;

    // Fetch data for the origin and destination airports
    const originData = await redis.hgetall(originKey);
    const destinationData = await redis.hgetall(destinationKey);

    // Extract latitude and longitude from the Redis response
    originLat = originData.latitude || null;
    originLon = originData.longitude || null;
    destLat = destinationData.latitude || null;
    destLon = destinationData.longitude || null;

    //console.log("Origin and Destination Data Fetched from Redis:");
    //console.log({ originLat, originLon, destLat, destLon });

  } 
  catch (error) {
    console.error("Error fetching latitude and longitude from Redis:", error);
    throw error;
  }

  // Return the latitude and longitude values
  return { originLat, originLon, destLat, destLon };
}

async function getGraphData(originAirport, destinationAirport) {
  let client;
  let queryResult;

  try {
    // Connect to MongoDB
    client = new MongoClient(uri); // Replace 'uri' with your MongoDB connection string
    await client.connect();
    console.log("Connected to MongoDB for graph data");

    // Access the database and collection
    const db = client.db(dbName); // Replace 'dbName' with your database name
    const collection = db.collection("flightroutes"); // Collection name

    // Run the updated aggregation pipeline
    queryResult = await collection.aggregate([
      {
        $match: {
          $text: { $search: `${originAirport} ${destinationAirport}` } // Text search for origin and destination
        }
      },
      {
        $addFields: {
          averagePrice: {
            $avg: [
              { 
                $convert: { 
                  input: "$largestCarrier.fare", 
                  to: "double", 
                  onError: null, 
                  onNull: null 
                } 
              },
              { 
                $convert: { 
                  input: "$lowestCarrier.fare", 
                  to: "double", 
                  onError: null, 
                  onNull: null 
                } 
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: { airline: "$largestCarrier.name", year: "$year", quarter: "$quarter" },
          avgPrice: { $avg: "$averagePrice" }
        }
      },
      {
        $group: {
          _id: { airline: "$_id.airline", quarter: "$_id.quarter" },
          years: {
            $push: {
              year: "$_id.year",
              avgPrice: "$avgPrice"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          airline: "$_id.airline",
          quarter: "$_id.quarter",
          years: 1
        }
      },
      {
        $sort: { quarter: 1, airline: 1 } // Sort by quarter and airline
      }
    ]).toArray();

  } 
  catch (error) {
    console.error("Error in getGraphData:", error);
    throw error;
  } 
  finally {
    // Ensure MongoDB connection is closed
    if (client) await client.close();
  }

  return queryResult; // Return the formatted graph data
}


async function getUserRecommendations() {
  let client;
  var queryResult;
  try {
    client = new MongoClient(uri); // Replace 'uri' with your MongoDB connection string
    await client.connect();
    console.log("Connected to MongoDB for user recommendations");

    const db = client.db(dbName); // Replace 'dbName' with your database name
    const collection = db.collection("accounts"); // Collection name

    queryResult = await collection.aggregate([
      {
        $match: {
          username: lastUsername
        }
      },
      {
        $project: {
          originAirport: 1,
          miles: 1,
          price: 1
        }
      },
      {
        $lookup: {
          from: "flightroutes",
          let: { 
            originAirportInput: "$originAirport",
            maxDistance: { $toDouble: "$miles" },
            inputPrice: { $toDouble: "$price" }
          },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$origin.airport", "$$originAirportInput"] }
              }
            },
            {
              $addFields: {
                distanceDeviation: { 
                  $abs: { 
                    $subtract: [
                      { 
                        $toDouble: { 
                          $cond: {
                            if: { 
                              $or: [
                                { $eq: [ "$nsmiles", "" ] }, 
                                { $eq: [ "$nsmiles", null ] }
                              ]
                            }, 
                            then: 0, 
                            else: "$nsmiles"
                          }
                        }
                      },
                      "$$maxDistance"
                    ] 
                  }
                },
                priceDeviation: { 
                  $abs: { 
                    $subtract: [
                      { 
                        $toDouble: { 
                          $cond: {
                            if: { 
                              $or: [
                                { $eq: [ "$lowestCarrier.fare", "" ] },
                                { $eq: [ "$lowestCarrier.fare", null ] }
                              ]
                            },
                            then: 0, 
                            else: "$lowestCarrier.fare"
                          }
                        }
                      },
                      "$$inputPrice"
                    ] 
                  }
                }
              }
            },
            {
              $sort: {
                distanceDeviation: 1,
                priceDeviation: 1
              }
            },
            {
              $group: {
                _id: "$quarter",
                bestFlight: { $first: "$$ROOT" }
              }
            },
            {
              $project: {
                _id: 0,
                quarter: "$_id",
                origin: "$bestFlight.origin.airport",
                destination: "$bestFlight.destination.airport",
                price: "$bestFlight.lowestCarrier.fare",
                miles: "$bestFlight.nsmiles",
                airline: "$bestFlight.lowestCarrier.name"
              }
            }
          ],
          as: "flightRoutes"
        }
      },
      {
        $project: {
          username: 1,
          originAirport: 1,
          flightRoutes: 1
        }
      },
      {
        $unwind: {
          path: "$flightRoutes",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: "$flightRoutes.quarter",
          quarterData: { $first: "$flightRoutes" }
        }
      },
      {
        $project: {
          quarter: "$_id",
          origin: { $ifNull: ["$quarterData.origin", null] },
          destination: { $ifNull: ["$quarterData.destination", null] },
          price: { $ifNull: ["$quarterData.price", null] },
          miles: { $ifNull: ["$quarterData.miles", null] },
          airline: { $ifNull: ["$quarterData.airline", null] }
        }
      },
      {
        $sort: {
          quarter: 1
        }
      }
    ]).toArray();
    //console.log(queryResult);
    
  } 
  catch (error) {
    console.error("Error in getUserRecommendations:", error);
    throw error;
  } 
  finally {
    if (client) await client.close();
  }
  return queryResult;
}

