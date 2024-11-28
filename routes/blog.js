const express = require('express');
const router = express.Router();
const blog = require('../models/blog');

const translateToFrench = async (markdownContent, title, author, shortDesc) => {
  try {
    // Preserve table syntax and image links
    const preservedMarkdown = markdownContent
      .replace(/\|/g, '[[VERTICAL_BAR]]')  // Preserve pipes used in tables
      .replace(/\n/g, '[[NEW_LINE]]');     // Preserve new lines for structure

    const textToTranslate = [preservedMarkdown, title, author, shortDesc];

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_SECRET_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: textToTranslate,           // Content to be translated
          target: 'fr',   // Target language
          format: 'text', // Plain text format
        }),
      }
    );

    const data = await response.json();

    if (response.status !== 200 || !data?.data?.translations) {
      return null;
    }

    // Extract translated texts
    const translatedMarkdownContent = data.data.translations[0].translatedText
      .replace(/\[\[VERTICAL_BAR\]\]/g, '|')  // Restore table syntax
      .replace(/\[\[NEW_LINE\]\]/g, '\n');    // Restore new lines

    return {
      translatedMarkdownContent, // Translated and structured markdown
      translatedTitle: data.data.translations[1].translatedText,
      translatedAuthor: data.data.translations[2].translatedText,
      translatedDescription: data.data.translations[3].translatedText,
    };
  } catch (err) {
    return null;
  }
};




router.post('/', async (req, res) => {
  const { title, slug, markdownContent, author, timeToRead, imageUrl, cloudinaryPubicUrl, cloudinaryAssetId, tags, shortDesc  } = req.body;

  try {
    // Check if blog with same slug already exists
    const existingBlog = await blog.findOne({ slug });

    if (existingBlog) {
      return res.status(400).json({
        message: 'Slug already exists. Please choose a different slug.',
      });
    }

    // Translate content, title, and author to French
    const translations = await translateToFrench(markdownContent, title, author, shortDesc);

    if (!translations) {
      return res.status(400).json({
        message: 'Translation not completed',
      });
    }

    const newBlog = new blog({
      slug,
      timeToRead,
      imageUrl,
      cloudinaryPubicUrl,
      cloudinaryAssetId,
      tags,
      translations: [
        {
          language: 'en',
          title, // Title in English
          markdownContent, // Markdown content in English
          author, // Author in English
          shortDesc,
        },
        {
          language: 'fr',
          title: translations.translatedTitle, // Translated title
          markdownContent: translations.translatedMarkdownContent, // Translated markdown content
          author: translations.translatedAuthor, // Translated author
          shortDesc: translations.translatedDescription,
        }
      ],
    });

    await newBlog.save();

    res.status(201).json({ message: 'Blog Created Successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});


router.get('/:slug', async (req, res) => {
  const slug = req.params.slug;

  try {
    const Blog = await blog.findOne({ slug });

    if (!Blog) {
      return res.status(404).json({ error: "Blog doesn't exist" });
    }

    return res.status(200).json({ message: [Blog] });
  } catch (error) {
    return res.status(500).json({ error: error });
  }
});


router.get("/", async (req, res) => {
  try {
    // Fetch blogs, including the timeToRead field and translations for title and shortDesc
    const blogs = await blog.find(
      {}, // No filter
      { 
        slug: 1, 
        imageUrl: 1, 
        tags: 1, // Include the tags field
        timeToRead: 1, // Include timeToRead
        "translations.language": 1, 
        "translations.title": 1, 
        "translations.shortDesc": 1 
      } // Projection: select necessary fields
    );

    // Check if no blogs are found
    if (blogs.length === 0) {
      return res.status(404).json({ error: "No blogs found." });
    }

    // Map through the blog data to return the necessary details
    const blogDetails = blogs.map(blogData => {
      const { slug, imageUrl, tags, timeToRead, translations } = blogData;

      // Extract only 'en' and 'fr' translations for title and shortDesc
      const enTranslation = translations.find(t => t.language === 'en');
      const frTranslation = translations.find(t => t.language === 'fr');

      return {
        slug: slug,
        imageUrl: imageUrl,
        tags: tags || [], // Ensure tags is always an array
        timeToRead: timeToRead, // Include timeToRead
        title: {
          en: enTranslation ? enTranslation.title : null,
          fr: frTranslation ? frTranslation.title : null
        },
        shortDesc: {
          en: enTranslation ? enTranslation.shortDesc : null,
          fr: frTranslation ? frTranslation.shortDesc : null
        }
      };
    });

    return res.status(200).json({ blogs: blogDetails });

  } catch (error) {
    return res.status(500).json({ error: error.message || "Server Error" });
  }
});





// GET: Retrieve a single blog by slug


module.exports = router;
