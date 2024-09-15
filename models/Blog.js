const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  author: {
    en: { type: String, required: true },
    fr: { type: String, required: true }
  },
  estimatedReadingTime: { type: String, required: true }, // e.g., "5 min read"
  tags: [{
    en: { type: String, required: true },
    fr: { type: String, required: true }
  }],
  content: {
    introduction: {
      en: { type: String, required: true },
      fr: { type: String, required: true }
    },
    sections: [{
      heading: {
        en: { type: String, required: true },
        fr: { type: String, required: true }
      },
      content: {
        en: { type: String, required: true },
        fr: { type: String, required: true }
      },
      subHeadings: [{
        subHeading: {
          en: { type: String },
          fr: { type: String }
        },
        bulletPoints: [{
          en: { type: String },
          fr: { type: String }
        }]
      }]
    }],
    conclusion: {
      en: { type: String, required: true },
      fr: { type: String, required: true }
    }
  },
  metadata: {
    description: {
      en: { type: String },
      fr: { type: String }
    },
    keywords: [{
      en: { type: String },
      fr: { type: String }
    }]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
