const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  translations: [
    {
      language: { type: String, required: true },
      title: { type: String, required: true },
      markdownContent: { type: String, required: true },
      author: { type: String, required: true },
    }
  ],
}, {
  timestamps: true
});

const Blogs = mongoose.models.Blogs || mongoose.model("Blogs", blogSchema);

module.exports = Blogs;