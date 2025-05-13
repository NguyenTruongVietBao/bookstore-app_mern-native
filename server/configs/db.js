const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB");
  } catch {
    console.error("Error connecting to MongoDB");
  }
};

module.exports = { connectDb };
