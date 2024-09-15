const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());

// Set CORS origin from environment variable
const allowedOrigin = process.env.WOUESSI_FRONTEND_URL

app.use(cors({
  origin: allowedOrigin
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected!');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to Wouessi Back Office');
});

app.get('/data', (req, res) => {
  res.json({ message: 'Hello from the Wouessi Back Office!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
