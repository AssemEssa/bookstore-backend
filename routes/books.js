import express from 'express';
import Book from '../models/Book.js';
import { protect, admin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// @route   GET /api/books
// @desc    Get all books with filters and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      featured, 
      bestseller, 
      sort = '-createdAt',
      page = 1,
      limit = 12 
    } = req.query;

    const query = {};

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (bestseller) query.bestseller = bestseller === 'true';
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Book.countDocuments(query);

    res.json({
      success: true,
      data: books,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   GET /api/books/:id
// @desc    Get single book
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/books
// @desc    Create a book with image upload
// @access  Private/Admin
router.post('/', protect, admin, upload.single('coverImage'), async (req, res) => {
  try {
    const bookData = req.body;

    // If file was uploaded, set the coverImage path
    if (req.file) {
      bookData.coverImage = `/uploads/books/${req.file.filename}`;
    }

    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   POST /api/books/upload
// @desc    Upload book cover image only
// @access  Private/Admin
router.post('/upload', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const imageUrl = `/uploads/books/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl: imageUrl,
      message: 'Image uploaded successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   PUT /api/books/:id
// @desc    Update a book
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('coverImage'), async (req, res) => {
  try {
    const bookData = req.body;

    // If new file was uploaded, update the coverImage path
    if (req.file) {
      bookData.coverImage = `/uploads/books/${req.file.filename}`;
    }

    const book = await Book.findByIdAndUpdate(req.params.id, bookData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// @route   DELETE /api/books/:id
// @desc    Delete a book
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    res.json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
