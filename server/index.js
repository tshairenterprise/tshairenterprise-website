// ✅ dotenv sabse upar
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const faqRoutes = require("./routes/faqRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const blogRoutes = require("./routes/blogRoutes");
const messageRoutes = require("./routes/messageRoutes");
const sitemapRoutes = require("./routes/sitemapRoutes");
const galleryRoutes = require("./routes/galleryRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Body parser + CORS
app.use(express.json());
app.use(cors());

// Mongo connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Health check
app.get("/", (req, res) => {
  res.send("TS Hair Enterprise API is Running.");
});

// ✅ API Routes (yahi pe /api/users mount ho raha hai)
app.use("/", sitemapRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/faqs", faqRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/gallery", galleryRoutes);

// Optional: unknown route handler (debug ke liye)
app.use((req, res) => {
  console.log("404 on:", req.method, req.originalUrl);
  res.status(404).json({ message: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
