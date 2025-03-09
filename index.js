const express = require("express");
const cors = require("cors");
const newsletterRoute = require("./routes/newsletterRoutes");
const categoryRoute = require("./routes/category");
const blogRoute = require("./routes/blog");
const contactRoute = require("./routes/contact");

require("dotenv").config({ path: "./.env" });
const connectToDB = require("./utils/database");

const app = express();

// Use CORS middleware with allowed origins
const allowedOrigins = [
  process.env.WOUESSI_FRONTEND_URL,
  "https://dev.wouessi.com/en",
  "https://dev.wouessi.com",
  "https://www.wouessi.com/en",
  "https://www.wouessi.com",
  "https://www.wouessi.ca/en/",
  "https://www.wouessi.ca",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(new Error("CORS policy violation"), false);
    },
    credentials: true,
  }),
);

// Middleware
app.use(express.json());

// API routes
app.use("/api/newsletter", newsletterRoute);
app.use("/api/blog", blogRoute);
app.use("/api/category", categoryRoute);
app.use("/api/contact", contactRoute);

// Base routes
app.get("/", (req, res) => {
  res.send("Welcome to Wouessi Back Office");
});

app.get("/data", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// Initialize the application
const initializeApp = async () => {
  try {
    // Connect to the database
    await connectToDB(process.env.MONGODB_NAME);

    // Start the server after successful database connection
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  }
};

// Start the application
initializeApp();

module.exports = app; // Export for testing purposes
