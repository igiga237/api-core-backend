const express = require('express');
const cors = require('cors');  // Import the CORS middleware
const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware to allow requests from your frontend
app.use(cors({
  origin: 'https://dev.wouessi.com' // Allow requests from this domain
}));

// Middleware for parsing JSON
app.use(express.json());

// Define your routes
app.get('/', (req, res) => {
  res.send('Welcome to Wouessi Back Office');
});


app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

app.get('/test', (req, res) => {
  res.json({ status: 'Server is up and running!', timestamp: new Date() });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
