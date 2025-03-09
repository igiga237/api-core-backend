require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const Category = require("../models/category");
const Blogs = require("../models/blog");
const connectToDB = require("../utils/database");

// Generate random blog data
const generateBlogs = async (count) => {
  const blogs = [];
  const categories = await Category.find(); // Fetch all existing categories

  if (categories.length === 0) {
    throw new Error("No categories found. Please seed categories first.");
  }

  for (let i = 0; i < count; i++) {
    // Generate between 1 and 4 unique category IDs for each blog
    const categoryCount = faker.number.int({ min: 1, max: 4 });
    const selectedCategories = [];

    // Ensure we don't select the same category twice
    const availableIndices = [...Array(categories.length).keys()]; // Create array of indices [0, 1, 2, ...]

    for (let j = 0; j < categoryCount && availableIndices.length > 0; j++) {
      // Pick a random index from the available indices
      const randomIndex = faker.number.int({
        min: 0,
        max: availableIndices.length - 1,
      });
      const categoryIndex = availableIndices[randomIndex];

      // Remove this index so we don't pick it again
      availableIndices.splice(randomIndex, 1);

      // Add the category ID to our selected categories
      selectedCategories.push(categories[categoryIndex]._id);
    }

    const blog = {
      slug: faker.lorem.slug() + "-" + faker.string.uuid(), // Unique slug
      timeToRead: faker.number.int({ min: 2, max: 60 }), // Reading time between 1 and 30 minutes
      imageUrl: faker.image.url(), // Random image URL
      cloudinaryPubicUrl: faker.image.url(), // Random Cloudinary public URL
      cloudinaryAssetId: faker.string.uuid(), // Random Cloudinary asset ID
      tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
        () => faker.lorem.word(),
      ), // 1 to 5 random tags
      translations: [
        {
          language: "en", // English translation
          title: faker.lorem.sentence({ min: 8, max: 15 }), // Random title
          markdownContent: faker.lorem.paragraphs({ min: 4, max: 9 }), // Random Markdown content
          author: faker.person.fullName(), // Random author name
          shortDesc: faker.lorem.sentence({ min: 15, max: 40 }), // Random short description
        },
        {
          language: "fr", // French translation
          title: faker.lorem.sentence({ min: 8, max: 15 }), // Random title
          markdownContent: faker.lorem.paragraphs({ min: 4, max: 9 }), // Random Markdown content
          author: faker.person.fullName(), // Random author name
          shortDesc: faker.lorem.sentence({ min: 15, max: 40 }), // Random short description
        },
      ],
      // Random category
      categories: [
        categories[faker.number.int({ min: 0, max: categories.length - 1 })]
          ._id,
      ],
    };
    blogs.push(blog);
  }
  return blogs;
};

// Insert blogs into the database
const seedBlogs = async () => {
  try {
    // Connect to the database
    await connectToDB(process.env.MONGODB_NAME);

    const count = 200;

    // Generate 200 blogs
    const blogs = await generateBlogs(count);

    // Insert blogs into the database
    await Blogs.insertMany(blogs);
    console.log(`${count} blogs have been successfully added to the database.`);

    // Close the database connection
    await mongoose.connection.close();
    console.log("Database connection closed.");
  } catch (error) {
    console.error("Error seeding blogs:", error);
    process.exit(1);
  }
};

// Run the seed script
seedBlogs();
