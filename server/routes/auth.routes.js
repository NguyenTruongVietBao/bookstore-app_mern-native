const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controllers');
const { protectRoute } = require('../middlewares/auth.middlewares');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Profile
router.get('/profile', protectRoute, authController.profile);

module.exports = router;
