const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    // SEO Friendly URL
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // Cover Image
    content: { type: String, required: true }, // Rich Text HTML
    excerpt: { type: String, required: true }, // Short Summary for Cards

    // SEO Meta Data
    tags: [{ type: String }],
    author: { type: String, default: "Admin" },

    isActive: { type: Boolean, default: true }, // Draft/Publish toggle
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
