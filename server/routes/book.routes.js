const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controllers");
const { protectRoute } = require("../middlewares/auth.middlewares");

// Get all
router.get("/", protectRoute, bookController.getAllBooks);

// // Get one
// router.get("/:id", bookController.getBookById);

// Create one
router.post("/", protectRoute, bookController.createBook);

// // Update one
// router.put("/:id", bookController.updateBook);

// Delete one
router.delete("/:id", protectRoute, bookController.deleteBook);

// // Get books by user
// router.get("/user/:userId", bookController.getBooksByUser);

module.exports = router;
