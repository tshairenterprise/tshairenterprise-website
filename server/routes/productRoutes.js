const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review"); // ✅ IMPORT REVIEW MODEL
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Cloudinary & Multer Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// @route   GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/products/:id (UPDATED FOR REVIEWS)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // ✅ FIX: Yahan bhi 'avatar' add kiya
      const reviews = await Review.find({ product: req.params.id })
        .populate("user", "name avatar")
        .sort({ createdAt: -1 }); // Latest pehle

      // Product data ke saath reviews jod kar bhejo
      const productWithReviews = { ...product.toObject(), reviews };

      res.json(productWithReviews);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/products/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete Images from Cloudinary logic... (Same as before)
    const getPublicIdFromUrl = (url) => {
      if (!url) return null;
      try {
        const parts = url.split("/");
        const filename = parts.pop();
        const folder = parts.pop();
        return `${folder}/${filename.split(".")[0]}`;
      } catch (err) {
        return null;
      }
    };
    if (product.image)
      await cloudinary.uploader.destroy(getPublicIdFromUrl(product.image));
    if (product.gallery)
      await Promise.all(
        product.gallery.map((img) =>
          cloudinary.uploader.destroy(getPublicIdFromUrl(img))
        )
      );

    // ✅ FIX: Delete associated reviews too
    await Review.deleteMany({ product: req.params.id });

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: "Product and reviews removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Toggle Best Seller
router.patch("/:id/bestseller", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      product.isBestSeller = !product.isBestSeller;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/products (Create)
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.image)
        return res.status(400).json({ message: "Main image required" });

      const uploadToCloudinary = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "ts-hair-products" },
            (err, res) => {
              if (err) reject(err);
              else resolve(res.secure_url);
            }
          );
          const bufferStream = require("stream").PassThrough();
          bufferStream.end(fileBuffer);
          bufferStream.pipe(stream);
        });
      };

      const mainImageUrl = await uploadToCloudinary(req.files.image[0].buffer);
      let galleryUrls = [];
      if (req.files.gallery) {
        galleryUrls = await Promise.all(
          req.files.gallery.map((file) => uploadToCloudinary(file.buffer))
        );
      }

      const { name, category, description, highlights, stock } = req.body;
      const variants = JSON.parse(req.body.variants || "[]");
      const colors = JSON.parse(req.body.colors || "[]");

      const product = new Product({
        name,
        category,
        variants,
        colors,
        stock: stock || 0,
        description,
        highlights,
        image: mainImageUrl,
        gallery: galleryUrls,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Error creating product", error: error.message });
    }
  }
);

// @route   PUT /api/products/:id (Update)
router.put(
  "/:id",
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (product) {
        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.stock = req.body.stock || product.stock;
        product.highlights = req.body.highlights || product.highlights;

        if (req.body.variants) product.variants = JSON.parse(req.body.variants);
        if (req.body.colors) product.colors = JSON.parse(req.body.colors);

        const uploadToCloudinary = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "ts-hair-products" },
              (err, res) => {
                if (err) reject(err);
                else resolve(res.secure_url);
              }
            );
            const bufferStream = require("stream").PassThrough();
            bufferStream.end(fileBuffer);
            bufferStream.pipe(stream);
          });
        };

        if (req.files && req.files.image) {
          const mainImageUrl = await uploadToCloudinary(
            req.files.image[0].buffer
          );
          product.image = mainImageUrl;
        }

        if (req.files && req.files.gallery) {
          const galleryUrls = await Promise.all(
            req.files.gallery.map((file) => uploadToCloudinary(file.buffer))
          );
          product.gallery = galleryUrls;
        }

        const updatedProduct = await product.save();
        res.json(updatedProduct);
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      res.status(400).json({ message: "Error updating product" });
    }
  }
);

// @route   GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (product) {
      // ✅ FIX: Product dhoondne ke baad, uske Reviews bhi dhoondo
      const reviews = await Review.find({ product: req.params.id })
        .populate('user', 'name') // User ka naam bhi lao
        .sort({ createdAt: -1 }); // Latest pehle

      // Product aur Reviews ko jod kar bhejo
      // .toObject() use karte hain taaki hum naya field add kar sakein
      const productWithReviews = { 
          ...product.toObject(), 
          reviews: reviews 
      };
      
      res.json(productWithReviews);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
