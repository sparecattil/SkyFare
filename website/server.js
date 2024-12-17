//////////////////////////////////////////////////////////////////////////////////////////////
// Contributors: Sebastian Parecattil, Shiv Patel
// Versions: Node - 23.3.0
//////////////////////////////////////////////////////////////////////////////////////////////

import express from 'express'; // Basic Library for web app
import { MongoClient } from 'mongodb'; // MongoDB driver for database connection
import path from 'path'; // Library for path transformation 
import http from 'http'; // Library for HTTP server
import Redis from 'ioredis'; // Library for Redis client
import { fileURLToPath } from 'url'; // Helper to manage __dirname in ES modules

// Initializing the express application
const app = express();

// Creating an HTTP server using express
const server = http.createServer(app);

// Define the port for the server, default to 3000 if environment variable is not set
const port = process.env.PORT || 3000;

// Starting the server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Initializes parsing of JSON requests
app.use(express.json()); 

const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Getting __dirname in ES Modules

// Serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Serve the userInformation.html file
app.get("/userInformation.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "userInformation.html"));
});

// Sends files from the "public" directory to the client
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection URI and Database Name
const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'SkyFare';

// Initialize MongoDB client
const client = new MongoClient(uri);

// Connect to the local Redis server (default port is 6379)
const redis = new Redis({
  host: '127.0.0.1', // Localhost
  port: 6379,        // Redis port
  db: 1              // Redis database index is set to 1
});

// Testing the connection
redis.on('connect', () => {
  console.log('Connected to Redis!');
});

redis.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});


//////////////////////////////////////////////////////////////////////////////////////////////
// Routes (From Client Received on the Server)
//////////////////////////////////////////////////////////////////////////////////////////////

// Fetch distinct airports
app.get('/one', async(req, res) => {
  try {
    const distinctAirports = await getDistinctAirports();
    res.json({ distinctAirports });
  } 
  catch (error) {
    console.error('Error in /one route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch price range and distance for a given origin airport
app.post('/two', async(req, res) => {
  const { originAirport } = req.body;

  if (!originAirport ) {
    return res.status(400).send('Origin not received on Server');
  }

  try {
    const { maxFare, minFare, maxMiles, minMiles } = await priceRangeAndDistance(originAirport);
    res.json({ maxFare, minFare, maxMiles, minMiles });
  } 
  catch (error) {
    console.error('Error in /two route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch all routes from an origin airport
app.post('/three', async(req, res) => {
  const { originAirport } = req.body;

  if (!originAirport ) {
    return res.status(400).send('Origin not received on Server');
  }

  try {
    const routesFromOrigin = await destRoutesFromOrigin(originAirport);
    res.json({ routesFromOrigin });
  } 
  catch (error) {
    console.error('Error in /three route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch graph data for the origin and destination airports
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
    console.error('Error in /four route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch user recommendations
app.get('/five', async(req, res) => {
  try {
    const recommendations = await getUserRecommendations();
    res.json({ recommendations });
  } 
  catch (error) {
    console.error('Error in /user route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch latitude and longitude of origin and destination airports
app.post('/seven', async(req, res) => {
  const { originAirport, destinationAirport } = req.body;

  if (!originAirport || !destinationAirport ) {
    return res.status(400).send('Origin and destination not received on Server');
  }

  try {
    const { originLat, originLon, destLat, destLon } = await getLatLong(originAirport, destinationAirport);
    res.json({ originLat, originLon, destLat, destLon });
  } 
  catch (error) {
    console.error('Error in /seven route:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch for user sign-in or account creation
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

// Fetch to update user details in MongoDB and Redis
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

// Fetch to check if the current user exists in Redis
app.get('/userActive', async(req, res) => {
  try {
    const exists = await checkUserExistence();
    res.json({ exists });
  } 
  catch (error) {
    console.error('Error in /userActive route:', error);
    res.status(500).send('Internal Server Error');
  }
});


//////////////////////////////////////////////////////////////////////////////////////////////
// Asynchronous Helper Functions to Query MongoDB and/or Redis
//////////////////////////////////////////////////////////////////////////////////////////////

var lastUsername; // Stores the last username that was logged in

//////////////////////////////////////////////////////
// Function Name: checkUserExistence
// Description: Checks if user still exists in Redis
//              If the TTL for the user expires then
//              the function will return false since
//              the user is no longer in Redis
//////////////////////////////////////////////////////
async function checkUserExistence() {
  var exists;
  try {
    const redisKey = `user:${lastUsername}`; // Key formatted with last username
    exists = await redis.exists(redisKey); // Check if the key exists in Redis

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

//////////////////////////////////////////////////////
// Function Name: setUserDetails
// Inputs: (string) the origin airport
//         (string) price
//         (string) miles
// Description: Updates user preferences in both 
//              MongoDB and Redis
//////////////////////////////////////////////////////
async function setUserDetails(originAirport, price, miles) {
  let client;

  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();

    // Access the database and the 'accounts' collection
    const db = client.db(dbName);
    const collection = db.collection("accounts");

    // Update the user document with the provided details
    const result = await collection.updateOne(
      { username: lastUsername },
      { 
        $set: {                   
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

    const redisKey = `user:${lastUsername}`; // Key formatted with last username

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


//////////////////////////////////////////////////////
// Function Name: signIn
// Inputs: (string) username
//         (string) password
// Description: Checks credentials or adds a new user 
//              to the MongoDB "accounts" collection
//////////////////////////////////////////////////////
async function signIn(username, password) {
  lastUsername = username; // Setting last username to the current username
  let client;
  var signInStatus;
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection("accounts");

    // Ensure the 'accounts' collection exists
    const collections = await db.listCollections({}, { nameOnly: true }).toArray();
    const collectionNames = collections.map((col) => col.name);
    if (!collectionNames.includes("accounts")) {
      await db.createCollection("accounts");
      console.log("Collection 'accounts' has been created.");
      await collection.createIndex({ username: 1 }, { unique: true }); // Creating a unique index on username
      console.log("Unique index on 'username' has been created.");
    }

    // Checking if the user already exists
    const existingUser = await collection.findOne({ username });

    if (existingUser) {
      // Validating the password
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
      // Inserting the new user
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
  return signInStatus;
}


//////////////////////////////////////////////////////
// Function Name: getDistinctAirports
// Description: Retrieves a list of distinct origin 
//              airports from the 'flightroutes' 
//              collection in MongoDB.
//////////////////////////////////////////////////////
async function getDistinctAirports() {
  var distinctAirports;

  try {
    // Connect to the MongoDB client
    await client.connect();

    // Access the database
    const db = client.db(dbName);
    if (!db) {
      throw new Error('Failed to initialize the database');
    }

    // Access the collection
    const collection = db.collection('flightroutes');
    if (!collection) {
      throw new Error('Collection "flightroutes" does not exist');
    }

    // Run the distinct query to fetch unique origin airports
    distinctAirports = await collection.distinct('origin.airport');
  } 
  catch (err) {
    console.error('Error running the query:', err);
  } 
  finally {
    await client.close();
  }
  return distinctAirports;
}


//////////////////////////////////////////////////////
// Function Name: priceRangeAndDistance
// Inputs: (string) the origin aiport
// Description: Gets the price range (max and min 
//              fares) and distance range (max and min
//              miles) for flights originating from a 
//              specific airport from MongoDB.
//////////////////////////////////////////////////////
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

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection('flightroutes');

    // Run the aggregation query
    const aggregationPipeline = [
      {
        $match: { "origin.airport": originAirport }
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
          _id: "$origin.airport",  
          maxFare: { $max: "$fares" },
          minFare: { $min: "$fares" },
          maxMiles: { $max: { $toDouble: "$nsmiles" } },
          minMiles: { $min: { $toDouble: "$nsmiles" } }
        }
      },
      {
        $addFields: {
          maxMiles: {
            $cond: {
              if: { $lt: ["$maxMiles", "$minMiles"] },
              then: "$minMiles",
              else: "$maxMiles"
            }
          },
          minMiles: {
            $cond: {
              if: { $lt: ["$maxMiles", "$minMiles"] },
              then: "$maxMiles",
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
            maxMiles: "$maxMiles", 
            minMiles: "$minMiles"  
          }
        }
      }
    ];

    const queryResult = await collection.aggregate(aggregationPipeline).toArray(); // Execute the aggregation pipeline

    // Formatting the result for send the max fare, min fare, max miles, and min miles
    if (queryResult.length > 0) {
      result = queryResult[0];
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
    throw error;
  } 
  finally {
    await client.close();
  }

  return { maxFare, minFare, maxMiles, minMiles };
}

//////////////////////////////////////////////////////
// Function Name: destRoutesFromOrigin
// Inputs: (string) username
//         (string) password
// Description: Retrieves all unique destination 
//              airports for a given origin airport 
//              from the 'flightroutes' collection in
//              MongoDB.
//////////////////////////////////////////////////////
async function destRoutesFromOrigin(originAirport) {
  let routes = [];

  try {
    // Connect to MongoDB
    await client.connect();

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection('flightroutes');

    // Run the aggregation query
    const result = await collection.aggregate([
      { 
        $match: { "origin.airport": originAirport }
      },
      { 
        $group: {
          _id: null, 
          destinations: { $addToSet: "$destination.airport" }
        }
      },
      { 
        $project: { 
          _id: 0, 
          destinations: { $sortArray: { input: "$destinations", sortBy: 1 } } 
        }
      }
    ]).toArray();

    // Extract destinations from the aggregation result
    if (result.length > 0) {
      routes = result[0].destinations;
    }
  } 
  catch (error) {
    console.error('Error in destRoutesFromOrigin:', error);
  } 
  finally {
    await client.close();
  }

  return routes;
}


//////////////////////////////////////////////////////
// Function Name: getLatLong
// Inputs: (string) the origin airport
//         (string) the destination airport
// Description: Retrieves the latitude and longitude 
//              for the specified origin and 
//              destination airports from Redis.
//////////////////////////////////////////////////////
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

  } 
  catch (error) {
    console.error("Error fetching latitude and longitude from Redis:", error);
    throw error;
  }

  return { originLat, originLon, destLat, destLon };
}


//////////////////////////////////////////////////////
// Function Name: getGraphData
// Inputs: (string) the origin airport
//         (string) the destination airport
// Description: Retrieves graph data showing average 
//              prices over years and quarters for 
//              flights between the specified origin 
//              and destination airports from MongoDB.
//////////////////////////////////////////////////////
async function getGraphData(originAirport, destinationAirport) {
  let client;
  let queryResult;

  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection("flightroutes");

    // Run the aggregation query
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
        $sort: { quarter: 1, airline: 1 }
      }
    ]).toArray();

  } 
  catch (error) {
    console.error("Error in getGraphData:", error);
    throw error;
  } 
  finally {
    if (client) await client.close();
  }

  return queryResult;
}


//////////////////////////////////////////////////////
// Function Name: getUserRecommendations
// Description: Generates flight recommendations for 
//              the currently active user based on 
//              their stored preferences (origin 
//              airport, max distance, and price) from
//              MongoDB.
//////////////////////////////////////////////////////
async function getUserRecommendations() {
  let client;
  var queryResult;
  try {
    // Connect to MongoDB
    client = new MongoClient(uri);
    await client.connect();

    // Access the database and collection
    const db = client.db(dbName);
    const collection = db.collection("accounts");

    // Run the aggregation query
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

