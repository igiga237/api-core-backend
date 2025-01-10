const express = require('express');
const cors = require('cors');
// const bodyParser = require('body-parser');
const newsletterRoute = require("./routes/newsletterRoutes");
const blogRoute = require("./routes/blog");
const contactRoute = require("./routes/contact");

require('dotenv').config({path : "./.env"});

const connectToDB = require("./utils/database");

const app = express();

// Use CORS middleware to allow requests from your frontend
app.use(cors({
  origin: [process.env.WOUESSI_FRONTEND_URL, "https://dev.wouessi.com/en", "https://dev.wouessi.com", "https://www.wouessi.com/en", "https://www.wouessi.com", "https://www.wouessi.ca/en/", "https://www.wouessi.ca"], // Dynamically set the allowed CORS origin
  credentials: true,
}));

// Middleware
app.use(express.json());

// Add the newsletter route
app.use('/api/newsletter', newsletterRoute);
app.use('/api/blog', blogRoute);
app.use('/api/contact', contactRoute);

const dbName = "Wouessi";

connectToDB(dbName)
  .then(() => {
    console.log(`Successfully connected to the database: ${dbName}`);
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if the connection fails
  });

// Define your routes
app.get('/', (req, res) => {
  res.send('Welcome to Wouessi Back Office');
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
