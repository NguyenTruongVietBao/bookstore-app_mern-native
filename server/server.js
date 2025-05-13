require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDb } = require('./configs/db');
const authRoutes = require('./routes/auth.routes');
const bookRoutes = require('./routes/book.routes');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

connectDb();

// Import routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
