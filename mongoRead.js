const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// MongoDB connection URI and database name
const uri = 'mongodb://127.0.0.1:27017'; // Local MongoDB
const dbName = 'SkyFare'; // Replace with your database name

let db;

// Connect to MongoDB
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
        console.log('Connected to MongoDB');
        db = client.db(dbName);
    })
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// API endpoint to query data
app.get('/data', async (req, res) => {
    console.log("Reached here");
    try {
        const collection = db.collection('flightroutes'); // Replace with your collection name
        const data = await collection.find().toArray();
        res.json(data);
    } catch (error) {
        console.error('Error querying MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

