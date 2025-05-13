const cloudinary = require('../lib/cloudinary.js');
const Book = require('../models/book.model');

exports.createBook = async (req, res) => {
  const { title, caption, rating, image } = req.body;
  try {
    if (!title || !caption || !rating || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: 'Rating must be between 1 and 5' });
    }

    // Upload image to cloudinary
    const uploadImage = await cloudinary.uploader.upload(image);
    const imageUrl = uploadImage.secure_url;

    const newBook = new Book({
      title,
      caption,
      image: imageUrl,
      rating,
      user: req.user._id,
    });
    console.log('newBook', newBook);

    await newBook.save();
    res.json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.log('error', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllBooks = async (req, res) => {
  // Pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  try {
    const books = await Book.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'name imageProfile');

    res.send({
      message: 'Books fetched successfully',
      books,
      totalBooks: await Book.countDocuments(),
      totalPages: Math.ceil((await Book.countDocuments()) / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    // Check if user is created book
    if (book.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    // Delete image from cloudinary
    if (book.image && book.image.includes('cloudinary')) {
      try {
        const publicId = book.image.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete image' });
      }
    }
    await book.deleteOne();
    res.json({ message: 'Book deleted successfully', book: book });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};
