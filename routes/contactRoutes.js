const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST /api/contact
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        const newContact = new Contact({ name, email, phone, subject, message });
        await newContact.save();

        res.status(201).json({ message: 'Contact saved successfully!', contact: newContact });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;