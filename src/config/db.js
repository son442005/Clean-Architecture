const mongoose = require("mongoose");
const logger = require("../utils/logger");

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    logger.error("MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  const options = {
    autoIndex: process.env.NODE_ENV !== "production",
  };

  try {
    const conn = await mongoose.connect(uri, options);
    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected. Attempting to reconnect...");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected.");
  });

  mongoose.connection.on("error", (err) => {
    logger.error(`MongoDB runtime error: ${err.message}`);
  });
};

module.exports = connectDB;