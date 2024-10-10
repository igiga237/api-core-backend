// models/Newsletter.js
const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate email subscriptions
    match: [/.+\@.+\..+/, 'Please enter a valid email'] // Basic email format validation
  }
}, { timestamps: true });

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

module.exports = Newsletter;
