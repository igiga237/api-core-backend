const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const TranslationService = require("../utils/translate")
const Blog = require('../models/blog');

// add a new category
router.post("/", async (req, res) => {
    const {name, slug, description } = req.body;

    try{
        // Verify if the category already exist
        const existingCatgory = await Category.findOne({
            $or: [{slug}]
        })

        if(existingCatgory){
            return res.status(400).json({
                message: "A category with this same name or slug already exists."
            });
        }

        // const translations = await TranslationService.translateCategoryContent(req.body);

        // create category
        const newCategory = new Category({
            slug,
            translations: [
                {
                    language: "en",
                    name,
                    description,
                },
            ]
        })

        await newCategory.save();

        res.status(201).json({
            message: 'Category Created Successfully',
            category: newCategory,
        });
    }catch (error) {
        res.status(500).json({
            message: "error creating category",
            error: error.message
        })
    }
})

router.get("/", async (req, res) => {
    try{
        const categories = await Category.find();
        return res.status(200).json({
            categories
        });
    }catch (error) {
        res.status(500).json({
            message: "error creating category",
            error: error.message
        })
    }
})

router.put("/:id", async (req, res) => {
    const categoryId = req.params.id;
    const { name, slug, description, translations } = req.body;

    try{
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                slug,
                description,
                translations,
            },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                error: "Catégorie non trouvée"
            });
        }

        res.status(200).json({
            message: 'Category successfully updated',
            category: updatedCategory
        });
    }catch (error) {
        res.status(500).json({
            message: "error creating category",
            error: error.message
        })
    }
})

// Delete a category (with verification of existing blogs)
router.delete('/:id', async (req, res) => {
    const categoryId = req.params.id;

    try {
        // Check for blogs in this category
        const blogCount = await Blog.countDocuments({ category: categoryId });

        if (blogCount > 0) {
            return res.status(400).json({
                message: "Unable to delete a category containing blogs"
            });
        }

        // delete category
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({
                error: "Category not found"
            });
        }

        res.status(200).json({
            message: 'Category successfully deleted'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting category',
            error: error.message
        });
    }
});

// retrieve a specific category with your blogs
router.get('/:slug', async (req, res) => {
    const slug = req.params.slug;

    try {
        // Trouver la catégorie par son slug
        const category = await Category.findOne({ slug });

        if (!category) {
            return res.status(404).json({
                error: "Category not found"
            });
        }

        // Récupérer les blogs de cette catégorie
        const blogs = await Blog.find({ category: category._id })
            .populate('categories', 'name slug')
            .select('slug imageUrl tags timeToRead translations');

        return res.status(200).json({
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                description: category.description
            },
            blogs: blogs.map(blog => ({
                slug: blog.slug,
                imageUrl: blog.imageUrl,
                tags: blog.tags,
                timeToRead: blog.timeToRead,
                translations: blog.translations
            }))
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message || "Server error"
        });
    }
});

module.exports = router;