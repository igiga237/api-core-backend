const mongoose = require("mongoose");
let connections = {};

/**
 * Connects to MongoDB database
 * @param {string} dbName - Name of the database to connect to
 * @returns {Promise<mongoose.Connection>} - Mongoose connection object
 */
const connectToDB = async (dbName) => {
  // Validate inputs
  if (!dbName) {
    throw new Error("Database name is required");
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is not defined");
  }

  // Set mongoose options
  mongoose.set("strictQuery", true);

  // Return existing connection if available
  if (connections[dbName]) {
    console.log(`Using existing MongoDB connection to ${dbName}`);
    return connections[dbName];
  }

  try {
    // Configure connection options
    const connectionOptions = {
      dbName: dbName,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    };

    // Connect to the database
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      connectionOptions,
    );

    // Store the connection
    connections[dbName] = connection;

    // Set up connection event handlers
    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn(`MongoDB disconnected from ${dbName}`);
    });

    // Handle application termination
    process.on("SIGINT", async () => {
      await mongoose.connection.close();
      console.log("MongoDB connection closed due to app termination");
      process.exit(0);
    });

    console.log(`MongoDB successfully connected to ${dbName}`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to MongoDB database ${dbName}:`, error);
    throw error; // Let the calling function handle the error
  }
};

module.exports = connectToDB;
