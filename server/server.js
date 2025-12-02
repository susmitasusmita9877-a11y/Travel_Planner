// server/server.js - Updated with optional passport support
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const tripRoutes = require("./routes/trips");
const uploadRoutes = require("./routes/uploads");

const app = express();

// Body parser
app.use(express.json({ limit: "10mb" }));

// CORS: allow frontend domain or localhost in dev
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);

// Connect to DB
connectDB();

// Optional: Initialize Passport only if Google OAuth is configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  const passport = require('passport');
  const session = require('express-session');
  
  // Session middleware (required for passport)
  app.use(
    session({
      secret: process.env.JWT_SECRET || 'fallback-secret',
      resave: false,
      saveUninitialized: false,
    })
  );
  
  // Initialize passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Load passport config
  require('./config/passport')(passport);
  
  console.log('✅ Google OAuth enabled');
} else {
  console.log('ℹ️  Running without Google OAuth (email/password only)');
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/uploads", uploadRoutes);

// Serve client (optional: if you prefer serving built client from same server)
if (process.env.NODE_ENV === "production") {
  const clientDistPath = path.join(__dirname, "../client/dist");
  app.use(express.static(clientDistPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});