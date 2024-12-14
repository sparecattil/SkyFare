const express = require('express'); // Basic Library for web app
const path = require('path'); // Library for path transformation 
const http = require('http'); // Library for HTTP server
const fetch = require('node-fetch'); // Library for making HTTP requests
const { MongoClient } = require('mongodb');

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
const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = "SkyFare"; // Replace with your database name

// Initialize MongoDB connection
let db;
MongoClient.connect(mongoURI)
  .then((client) => {
    console.log("Connected to MongoDB");
    db = client.db(dbName);
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

