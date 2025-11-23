const express = require('express');
const multer = require('multer');
const Joi = require('joi');
const Article = require('../models/article.model');
const requireAdmin=require("../middleware/authRole");
const authenticateToken  = require('../middleware/authenticateToken');
const router = express.Router();

// Configure Multer for file uploads
const upload = multer({ dest: 'uploads/' });


const articleSchema = Joi.object({
  title: Joi.string().required(),
  text: Joi.string().required(),
  photo: Joi.string().allow(null, ''), // Allow photo to be a string or null
});

// Create a new article (Admins Only)
router.post('/create', authenticateToken, requireAdmin, upload.single('photo'), async (req, res) => {
    try {
      const { title, text, photo: photoFromBody } = req.body;
      const photo = req.file ? req.file.path : photoFromBody; // Use uploaded file or URL from the body
  
      // Validate the input
      const { error } = articleSchema.validate({ title, text, photo });
      if (error) {
        return res.status(400).json({ success: false, message: error.details[0].message });
      }
  
      const article = new Article({
        title,
        text,
        photo,
        createdBy: req.user.id, // Store the ID of the logged-in user
      });
  
      await article.save();
  
      res.status(201).json({ success: true, message: 'Article created successfully', article });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error creating article', error: error.message });
    }
  });
  

// Get all articles with pagination
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const articles = await Article.find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const totalArticles = await Article.countDocuments();

    res.status(200).json({
      success: true,
      articles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching articles', error: error.message });
  }
});

// Update an article (Only Creator Can Update)
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, photo } = req.body;

    // Validate the input
    const { error } = articleSchema.validate({ title, text, photo });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Find the article by ID
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Check if the logged-in user is the creator of the article
    if (article.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied. Only the creator can update this article.' });
    }

    // Update the article
    article.title = title;
    article.text = text;
    article.photo = photo || article.photo;
    await article.save();

    res.status(200).json({ success: true, message: 'Article updated successfully', article });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating article', error: error.message });
  }
});

// Delete an article (Admins Only)
router.delete('/delete/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    res.status(200).json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting article', error: error.message });
  }
});
// Fetch a single article by ID
router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find the article by ID
      const article = await Article.findById(id).populate('createdBy', 'username');
      if (!article) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
  
      res.status(200).json({ success: true, article });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching the article', error: error.message });
    }
  });
  

module.exports = router;