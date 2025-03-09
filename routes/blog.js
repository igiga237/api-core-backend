const express = require("express");
const router = express.Router();
const blog = require("../models/blog");
const TranslationService = require("../utils/translate");

router.post("/", async (req, res) => {
  const {
    title,
    slug,
    markdownContent,
    author,
    timeToRead,
    imageUrl,
    cloudinaryPubicUrl,
    cloudinaryAssetId,
    tags,
    shortDesc,
    categoryIds,
  } = req.body;

  try {
    // Check if blog with same slug already exists
    const existingBlog = await blog.findOne({ slug });

    if (existingBlog) {
      return res.status(400).json({
        message: "Slug already exists. Please choose a different slug.",
      });
    }

    // Validate that categoryIds is an array
    if (
      !categoryIds ||
      !Array.isArray(categoryIds) ||
      categoryIds.length === 0
    ) {
      return res.status(400).json({
        message: "At least one category is required.",
      });
    }

    // Translate content, title, and author to French
    // const translations = await translateToFrench(markdownContent, title, author, shortDesc);
    // const translations = await TranslationService.translateCategoryContent(req.body)

    // if (!translations) {
    //   return res.status(400).json({
    //     message: 'Translation not completed',
    //   });
    // }

    const newBlog = new blog({
      slug,
      timeToRead,
      imageUrl,
      cloudinaryPubicUrl,
      cloudinaryAssetId,
      tags,
      translations: [
        {
          language: "en",
          title, // Title in English
          markdownContent, // Markdown content in English
          author, // Author in English
          shortDesc,
        },
        // {
        //   language: 'fr',
        //   title: translations.translatedTitle, // Translated title
        //   markdownContent: translations.translatedMarkdownContent, // Translated markdown content
        //   author: translations.translatedAuthor, // Translated author
        //   shortDesc: translations.translatedDescription,
        // }
      ],
      categories: categoryIds,
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/:slug", async (req, res) => {
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.perPage) || 12;
    const search = req.query.search || "";
    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (search) {
      searchQuery["translations.title"] = { $regex: search, $options: "i" };
    }

    const totalBlogs = await blog.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalBlogs / limit);

    const blogs = await blog.find(searchQuery).select().skip(skip).limit(limit);

    return res.status(200).json({
      blogs: blogs.map((blogData) => {
        const { translations } = blogData;

        // Extract only 'en' and 'fr' translations for title and shortDesc
        const enTranslation = translations.find((t) => t.language === "en");
        const frTranslation = translations.find((t) => t.language === "fr");

        return {
          slug: blogData.slug,
          imageUrl: blogData.imageUrl || "https://via.placeholder.com/300",
          tags: blogData.tags || [],
          timeToRead: blogData.timeToRead || 0,
          title: {
            en: enTranslation ? enTranslation.title : null,
            fr: frTranslation ? frTranslation.title : null,
          },
          shortDesc: {
            en: enTranslation ? enTranslation.shortDesc : null,
            fr: frTranslation ? frTranslation.shortDesc : null,
          },
          categories: blogData.categories,
        };
      }),
      pagination: {
        currentPage: page,
        lastPage: totalPages,
        perPage: limit,
        totalBlogs,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Server Error" });
  }
});

// GET: Retrieve a single blog by slug

module.exports = router;
