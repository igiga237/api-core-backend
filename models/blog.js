const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  timeToRead: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  cloudinaryPubicUrl: { type: String, required: true },
  cloudinaryAssetId: { type: String, required: true },
  tags: [{ type: String }], // Array of strings for tags
  translations: [
    {
      language: { type: String, required: true },
      title: { type: String, required: true },
      markdownContent: { type: String, required: true },
      author: { type: String, required: true },
      shortDesc: { type: String, required: true },
    }
  ],
}, {
  timestamps: true
});

const Blogs = mongoose.models.Blogs || mongoose.model("Blogs", blogSchema);

module.exports = Blogs;