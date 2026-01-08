const express = require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Cloudinary Config (Reusing existing config)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper: Title se Slug Banana
const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Non-alphanumeric chars ko '-' se replace karo
    .replace(/(^-|-$)+/g, ""); // Start/End ke '-' hatao
};

// @route   GET /api/blogs
// @desc    Get all active blogs (Public)
router.get("/", async (req, res) => {
  try {
    // Sirf active blogs bhejo, latest pehle
    const blogs = await Blog.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/blogs/admin
// @desc    Get ALL blogs (Admin)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/blogs/:slug
// @desc    Get Single Blog by Slug (SEO Friendly)
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug, isActive: true });
    if (blog) res.json(blog);
    else res.status(404).json({ message: "Blog not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/blogs
// @desc    Create Blog (Admin)
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const { title, content, excerpt, tags } = req.body;
    let imageUrl = "";

    // Image Upload Logic
    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ts-hair-blogs" },
          (err, result) => {
            if (err) reject(err);
            else {
              imageUrl = result.secure_url;
              resolve();
            }
          }
        );
        const bufferStream = require("stream").PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(stream);
      });
    }

    const blog = await Blog.create({
      title,
      slug: createSlug(title), // Auto-generate slug
      content,
      excerpt,
      tags: tags ? JSON.parse(tags) : [],
      image: imageUrl,
    });

    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Error creating blog" });
  }
});

// @route   PUT /api/blogs/:id
// @desc    Update Blog (Admin)
router.put("/:id", protect, admin, upload.single("image"), async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    blog.title = req.body.title || blog.title;
    if (req.body.title) blog.slug = createSlug(req.body.title); // Update slug if title changes
    blog.content = req.body.content || blog.content;
    blog.excerpt = req.body.excerpt || blog.excerpt;
    if (req.body.tags) blog.tags = JSON.parse(req.body.tags);
    if (req.body.isActive !== undefined) blog.isActive = req.body.isActive;

    if (req.file) {
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ts-hair-blogs" },
          (err, result) => {
            if (err) reject(err);
            else {
              blog.image = result.secure_url;
              resolve();
            }
          }
        );
        const bufferStream = require("stream").PassThrough();
        bufferStream.end(req.file.buffer);
        bufferStream.pipe(stream);
      });
    }

    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: "Update Failed" });
  }
});

// @route   DELETE /api/blogs/:id
// @desc    Delete Blog
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Blog.deleteOne({ _id: req.params.id });
    res.json({ message: "Blog removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
