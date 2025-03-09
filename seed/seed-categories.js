require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Category = require("../models/category");
const connectToDB = require("../utils/database");

// Generate random category data
const generateCategories = (count) => {
  const categories = [];
  for (let i = 0; i < count; i++) {
    const category = {
      slug: faker.lorem.slug(), // Generate a unique slug
      translations: [
        {
          language: "en", // English translation
          name: faker.commerce.department(), // Random department name
          description: faker.lorem.sentence(30), // Random description
        },
        {
          language: "fr", // French translation
          name: faker.commerce.department(), // Random department name
          description: faker.lorem.sentence(30), // Random description
        },
      ],
    };
    categories.push(category);
  }
  return categories;
};

// Insert categories into the database
const seedCategories = async () => {
  try {
    // Connect to the database
    await connectToDB(process.env.MONGODB_NAME);

    const count = 10;

    // Generate 20 categories
    const categories = generateCategories(count);

    // Insert categories into the database
    await Category.insertMany(categories);
    console.log(
      `${count} categories have been successfully added to the database.`,
    );

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
};

// Run the seed script
seedCategories();
