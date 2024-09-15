const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

router.get('/blogs', async (req, res) => {
  const language = req.query.language;
  try {
    const blogs = await Blog.find({ language });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

module.exports = router;
