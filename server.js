const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'https://dev.wouessi.com' 
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
