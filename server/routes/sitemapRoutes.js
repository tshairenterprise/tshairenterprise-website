const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Blog = require("../models/Blog");

// @route   GET /sitemap.xml
// @desc    Generate dynamic sitemap for products and blogs
router.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = "https://tshairenterprise.com";

    // 1. Fetch Dynamic Data
    const products = await Product.find({}, "id updatedAt");
    const blogs = await Blog.find({ isActive: true }, "slug updatedAt");

    // 2. Static Pages Definition
    const staticPages = [
      "",
      "/shop",
      "/contact",
      "/blogs",
      "/review-us",
      "/search",
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // 3. Add Static Pages
    staticPages.forEach((page) => {
      sitemap += `
        <url>
            <loc>${baseUrl}${page}</loc>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>`;
    });

    // 4. Add Dynamic Products (High Priority for SEO)
    products.forEach((product) => {
      sitemap += `
        <url>
            <loc>${baseUrl}/product/${product._id}</loc>
            <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>1.0</priority>
        </url>`;
    });

    // 5. Add Dynamic Blogs (Content Marketing)
    blogs.forEach((blog) => {
      sitemap += `
        <url>
            <loc>${baseUrl}/blog/${blog.slug}</loc>
            <lastmod>${new Date(blog.updatedAt).toISOString()}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>`;
    });

    sitemap += `</urlset>`;

    // 6. Send XML Response
    res.header("Content-Type", "application/xml");
    res.send(sitemap);
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
    res.status(500).end();
  }
});

module.exports = router;
