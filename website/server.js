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

const __dirname = path.dirname(new URL(import.meta.url).pathname);

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

// Async function to connect and run a distinct query
async function getDistinctAirports() {
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
    const distinctAirports = await collection.distinct('origin.airport');
    console.log('Distinct airports:', distinctAirports);

  } 
  catch (err) {
    console.error('Error running the query:', err);
  } 
  finally {
    await client.close();
  }
}

getDistinctAirports();