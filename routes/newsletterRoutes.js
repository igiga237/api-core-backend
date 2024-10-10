// routes/newsletterRoutes.js
const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');

// POST: Add new email to the newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;

  try {
    // Check if email already exists
    const existingEmail = await Newsletter.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    // Create and save new email subscription
    const newSubscription = new Newsletter({ email });
    await newSubscription.save();

    res.status(201).json({ message: "Successfully subscribed to the newsletter!" });
  } catch (error) {
    console.error("Error subscribing to the newsletter:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
