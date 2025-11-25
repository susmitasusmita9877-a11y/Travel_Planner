// server/config/db.js - Improved with better error handling
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    console.log("Attempting to connect to MongoDB...");

    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log("✅ MongoDB connected successfully");
    console.log(`📍 Connected to: ${mongoose.connection.host}`);
    
  } catch (err) {
    console.error("❌ MongoDB connection error:");
    console.error("Error message:", err.message);
    
    // Provide helpful error messages
    if (err.message.includes("IP")) {
      console.error("\n🔒 IP WHITELIST ERROR:");
      console.error("Your IP address is not whitelisted in MongoDB Atlas.");
      console.error("Follow these steps:");
      console.error("1. Go to https://cloud.mongodb.com/");
      console.error("2. Navigate to Network Access");
      console.error("3. Add your current IP address");
      console.error("4. Or add 0.0.0.0/0 to allow all IPs (dev only)\n");
    }
    
    if (err.message.includes("authentication")) {
      console.error("\n🔑 AUTHENTICATION ERROR:");
      console.error("Check your MongoDB username and password in .env file\n");
    }
    
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;