const express = require('express');
const cors = require('cors');
const allowedOrigin = process.env.WOUESSI_FRONTEND_URL; // Get the allowed origin from environment variables
const bodyParser = require('body-parser');
const contactRoutes = require('./routes/contactRoutes');
const newsletterRoute = require("./routes/newsletterRoutes");

require('dotenv').config();  // Load environment variables
const connectToDB = require("./utils/database");
const portfolioRoutes = require('./routes/portfolioRoutes');

// Create Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Use CORS middleware to allow requests from your frontend
app.use(cors({
  origin: allowedOrigin, // Dynamically set the allowed CORS origin
  credentials: true,     // If you need to support cookies, enable this
}));

// Connect to MongoDB with a specific database name
const dbName = "Wouessi"; // You can replace this with any database name

connectToDB(dbName)
  .then(() => {
    console.log(`Successfully connected to the database: ${dbName}`);
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit the process if the connection fails
  });

// Use the portfolio routes
app.use("/api", portfolioRoutes);

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/contact', contactRoutes);

app.use("/api/newsletter", newsletterRoute);

app.use(
    '/graphql',
    graphqlHTTP({
        schema: newsletterSchema, // Use the schema here
        graphiql: true, // Enables GraphiQL interface for testing
    })
);

// Use CORS middleware to allow requests from your frontend
app.use(cors({
  origin: allowedOrigin  // Dynamically set the allowed CORS origin
}));

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
