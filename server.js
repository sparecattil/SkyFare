const express = require('express'); // Basic Library for web app
const path = require('path'); // Library for path transformation 
const http = require('http'); // Library for HTTP server
const fetch = require('node-fetch'); // Library for making HTTP requests

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

// Sends files from the "public" directory to the client
app.use(express.static(path.join(__dirname, "public")));