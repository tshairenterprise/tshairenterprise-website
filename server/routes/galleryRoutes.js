const express = require("express");
const router = express.Router();
const Gallery = require("../models/Gallery");
const { protect, admin } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");

// --- Cloudinary Config ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// --- Multer Config ---
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// --- Helper: Upload Middleware with Error Handling ---
// Ye naya function hai jo Multer errors ko catch karega
const uploadImage = (req, res, next) => {
  upload.single("image")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ message: "File size too large. Max limit is 5MB." });
      }
      return res.status(400).json({ message: "Image upload error." });
    } else if (err) {
      return res.status(500).json({ message: "Server upload error." });
    }
    // Agar koi error nahi hai, to aage badho
    next();
  });
};

// --- Helper: Upload to Cloudinary ---
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "ts-hair-gallery",
        format: "webp",
        resource_type: "image",
      },
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

// --- Helper: Get Public ID ---
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
//                                ROUTES
// ============================================================================

// @route   GET /api/gallery
router.get("/", async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/gallery
// Yahan humne 'uploadImage' use kiya hai instead of seedha 'upload.single'
router.post("/", protect, admin, uploadImage, async (req, res) => {
  try {
    const { altText } = req.body;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Please select an image to upload." });
    }

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const newImage = new Gallery({
      imageUrl,
      altText: altText || "TS Hair Enterprise Gallery Image",
    });

    const savedImage = await newImage.save();
    res.status(201).json(savedImage);
  } catch (err) {
    console.error("Gallery Upload Error:", err);
    res.status(500).json({ message: "Image upload failed." });
  }
});

// @route   PUT /api/gallery/:id
router.put("/:id", protect, admin, uploadImage, async (req, res) => {
  try {
    const { altText } = req.body;
    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    if (altText) image.altText = altText;

    if (req.file) {
      const publicId = getPublicIdFromUrl(image.imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
      const newImageUrl = await uploadToCloudinary(req.file.buffer);
      image.imageUrl = newImageUrl;
    }

    const updatedImage = await image.save();
    res.json(updatedImage);
  } catch (err) {
    console.error("Gallery Update Error:", err);
    res.status(500).json({ message: "Update failed." });
  }
});

// @route   DELETE /api/gallery/:id
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    const publicId = getPublicIdFromUrl(image.imageUrl);
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }

    await image.deleteOne();
    res.json({ message: "Image permanently deleted" });
  } catch (err) {
    console.error("Gallery Delete Error:", err);
    res.status(500).json({ message: "Delete failed." });
  }
});

module.exports = router;
