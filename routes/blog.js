const express = require('express');
const router = express.Router();
const blog = require('../models/blog');

const translateToFrench = async (markdownContent, title, author) => {
  try {
    // Preserve table syntax and image links
    const preservedMarkdown = markdownContent
      .replace(/\|/g, '[[VERTICAL_BAR]]')  // Preserve pipes used in tables
      .replace(/\n/g, '[[NEW_LINE]]');     // Preserve new lines for structure

    const a = [preservedMarkdown, title, author];

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_SECRET_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: a,           // Content to be translated
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
    };
  } catch (err) {
    return null;
  }
};




router.post('/', async (req, res) => {
  const { title, slug, markdownContent, author } = req.body;

  try {
    // Check if blog with same slug already exists
    const existingBlog = await blog.findOne({ slug });

    if (existingBlog) {
      return res.status(400).json({
        message: 'Slug already exists. Please choose a different slug.',
      });
    }

    // Translate content, title, and author to French
    const translations = await translateToFrench(markdownContent, title, author);

    if (!translations) {
      return res.status(400).json({
        message: 'Translation not completed',
      });
    }

    const newBlog = new blog({
      slug,
      translations: [
        {
          language: 'en',
          title, // Title in English
          markdownContent, // Markdown content in English
          author, // Author in English
        },
        {
          language: 'fr',
          title: translations.translatedTitle, // Translated title
          markdownContent: translations.translatedMarkdownContent, // Translated markdown content
          author: translations.translatedAuthor, // Translated author
        }
      ],
    });

    await newBlog.save();

    res.status(201).json({ message: 'Blog Created Successfully' });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});




router.get("/", async (req, res) => {
  try {
    // Fetch blogs, but only select the necessary fields (slug and translations for en/fr)
    const blogs = await blog.find(
      {}, // No filter
      { slug: 1, "translations.language": 1, "translations.title": 1 } // Projection: only select slug and translations for language and title
    );

    // Check if no blogs are found
    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found." });
    }

    // Map through the blog data to return only the en and fr titles
    const blogTitles = blogs.map(blogData => {
      const { slug, translations } = blogData;

      // Extract only 'en' and 'fr' titles
      const enTranslation = translations.find(t => t.language === 'en');
      const frTranslation = translations.find(t => t.language === 'fr');

      return {
        slug: slug,
        title: {
          en: enTranslation ? enTranslation.title : null,
          fr: frTranslation ? frTranslation.title : null
        }
      };
    });

    return res.status(200).json({ blogs: blogTitles });

  } catch (error) {
    return res.status(500).json({ error: error.message || "Server Error" });
  }
});



// GET: Retrieve a single blog by slug
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

module.exports = router;
