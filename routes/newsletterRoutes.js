const express = require("express");
const router = express.Router();
const Newsletter = require("../models/newsletter");
const nodemailer = require("nodemailer");

// POST /api/newsletter
router.post("/", async (req, res) => {
    const { email } = req.body;

    try {
        // Save email to MongoDB
        const newSubscriber = new Newsletter({ email });
        await newSubscriber.save();

        // Send email notification using Nodemailer
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "your-email@gmail.com",  // Replace with your email
                pass: "your-password",         // Replace with your email password
            },
        });

        let mailOptions = {
            from: "your-email@gmail.com",      // Replace with your email
            to: email,
            subject: "Thank you for subscribing!",
            text: "You've successfully subscribed to our newsletter.",
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ message: "Error sending email" });
            } else {
                return res.status(200).json({ message: "Email sent and subscription saved!" });
            }
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ message: "Email already subscribed" });
        }
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
