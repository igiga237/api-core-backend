const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact"); // Import Contact model

// POST route to handle contact form submission
router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Input validation (you can add more as per your requirement)
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save contact data to the database
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    const savedContact = await newContact.save(); // Save the document

    if (!savedContact) {
      return res
        .status(400)
        .json({ error: "Some  error occurred while saving contact" });
    }

    return res
      .status(200)
      .json({ message: "Contact form submitted successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});

module.exports = router;
