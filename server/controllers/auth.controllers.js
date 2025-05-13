const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../lib/utils');

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }
    if (username.length < 3) {
      return res
        .status(400)
        .json({ message: 'username must be at least 3 characters long' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profileImage: `https://api.dicebear.com/9.x/notionists-neutral/svg?seed=${username}`,
    });

    // Save user to database
    await newUser.save();

    // Generate jwt
    const accessToken = generateToken(newUser._id);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: newUser,
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Email doesn't exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: 'Password must be at least 6 characters long' });
    }
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateToken(user._id);

    res.status(201).json({
      message: 'User login successfully',
      data: {
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res
      .status(200)
      .json({ message: 'User profile fetched successfully', data: { user } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
