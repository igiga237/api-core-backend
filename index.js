const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

// Use CORS middleware to allow requests from your frontend
const allowedOrigin = process.env.WOUESSI_FRONTEND_URL; // Get the allowed origin from environment variables

app.use(cors({
  origin: allowedOrigin  // Dynamically set the allowed CORS origin
}));

// Middleware for parsing JSON
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected!');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Portfolio schema
const portfolioSchema = new mongoose.Schema({
  image: String,
  title: String,
  link: String,
});

const Portfolio = mongoose.model('Portfolio', portfolioSchema, 'Portfolio');

// Fetch all portfolio items
app.get('/portfolio', async (req, res) => {
  try {
    const portfolio = await Portfolio.find();
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Post a portfolio items
app.post('/portfolio', async (req, res) => {
  const { image, title, link } = req.body;
  try {
    const newPortfolio = new Portfolio({ image, title, link });
    await newPortfolio.save();
    res.status(201).json(newPortfolio);
  } catch (error) {
    console.error('Error adding portfolio', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fetch a single portfolio item by ID
app.get('/portfolios/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


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
