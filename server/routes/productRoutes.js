const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Review = require("../models/Review"); // ✅ IMPORT REVIEW MODEL
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream"); // ✅ Required for buffer stream

// --- Configuration ---

// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer Config
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- Helper Functions ---

// Helper: Upload Buffer to Cloudinary (Reusable)
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ts-hair-products", resource_type: "auto" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);
    bufferStream.pipe(uploadStream);
  });
};

// Helper: Extract Public ID for Deletion
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

// ============================================================================
//                              PRODUCT ROUTES
// ============================================================================

// @route   GET /api/products
// @desc    Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product with Reviews
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      // ✅ FIX: Fetch associated reviews
      const reviews = await Review.find({ product: req.params.id })
        .populate("user", "name avatar") // User details for review card
        .sort({ createdAt: -1 }); // Latest reviews first

      // Combine Product + Reviews
      const productWithReviews = {
        ...product.toObject(),
        reviews: reviews,
      };

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
// @desc    Delete product, its images, and its reviews
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 1. Delete Main Image
    if (product.image) {
      const publicId = getPublicIdFromUrl(product.image);
      if (publicId) await cloudinary.uploader.destroy(publicId);
    }

    // 2. Delete Gallery Images
    if (product.gallery && product.gallery.length > 0) {
      await Promise.all(
        product.gallery.map((img) => {
          const pid = getPublicIdFromUrl(img);
          return pid ? cloudinary.uploader.destroy(pid) : Promise.resolve();
        })
      );
    }

    // 3. Delete Associated Reviews
    await Review.deleteMany({ product: req.params.id });

    // 4. Delete Product
    await Product.deleteOne({ _id: req.params.id });

    res.json({ message: "Product and reviews removed" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PATCH /api/products/:id/bestseller
// @desc    Toggle Best Seller Status
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

// @route   POST /api/products
// @desc    Create a new product
router.post(
  "/",
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      if (!req.files || !req.files.image)
        return res.status(400).json({ message: "Main image required" });

      // 1. Parse Array Fields (Handling FormData Strings)
      let variants = [];
      let colors = [];
      try {
        if (req.body.variants) {
          variants =
            typeof req.body.variants === "string"
              ? JSON.parse(req.body.variants)
              : req.body.variants;
        }
        if (req.body.colors) {
          colors =
            typeof req.body.colors === "string"
              ? JSON.parse(req.body.colors)
              : req.body.colors;
        }
      } catch (parseError) {
        return res
          .status(400)
          .json({ message: "Invalid variants/colors format" });
      }

      // 2. Upload Main Image
      const mainImageUrl = await uploadToCloudinary(req.files.image[0].buffer);

      // 3. Upload Gallery Images (if any)
      let galleryUrls = [];
      if (req.files.gallery) {
        galleryUrls = await Promise.all(
          req.files.gallery.map((file) => uploadToCloudinary(file.buffer))
        );
      }

      // 4. Create Product
      const product = new Product({
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        highlights: req.body.highlights,
        stock: req.body.stock || 0,
        isBestSeller: req.body.isBestSeller === "true", // FormData handling
        variants,
        colors,
        image: mainImageUrl,
        gallery: galleryUrls,
        user: req.user._id,
      });

      const createdProduct = await product.save();
      res.status(201).json(createdProduct);
    } catch (error) {
      console.error("Create Product Error:", error);
      res
        .status(400)
        .json({ message: "Error creating product", error: error.message });
    }
  }
);

// @route   PUT /api/products/:id
// @desc    Update a product
router.put(
  "/:id",
  protect,
  admin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "gallery", maxCount: 10 },
  ]),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);

      if (product) {
        // Update basic fields
        product.name = req.body.name || product.name;
        product.category = req.body.category || product.category;
        product.description = req.body.description || product.description;
        product.stock = req.body.stock || product.stock;
        product.highlights = req.body.highlights || product.highlights;

        if (req.body.isBestSeller !== undefined) {
          product.isBestSeller = req.body.isBestSeller === "true";
        }

        // Update Arrays (Safely Parse)
        if (req.body.variants) {
          product.variants =
            typeof req.body.variants === "string"
              ? JSON.parse(req.body.variants)
              : req.body.variants;
        }
        if (req.body.colors) {
          product.colors =
            typeof req.body.colors === "string"
              ? JSON.parse(req.body.colors)
              : req.body.colors;
        }

        // Update Images (Only if new ones provided)
        if (req.files && req.files.image) {
          // Delete old main image to save space (Optional but recommended)
          const publicId = getPublicIdFromUrl(product.image);
          if (publicId) await cloudinary.uploader.destroy(publicId);

          const mainImageUrl = await uploadToCloudinary(
            req.files.image[0].buffer
          );
          product.image = mainImageUrl;
        }

        if (req.files && req.files.gallery) {
          // Note: This logic REPLACES the gallery.
          // To APPEND, you would push to product.gallery instead.
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
      console.error("Update Product Error:", error);
      res.status(400).json({ message: "Error updating product" });
    }
  }
);

module.exports = router;
