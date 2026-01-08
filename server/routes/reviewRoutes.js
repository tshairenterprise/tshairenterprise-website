const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

// Helper Function: Product Rating Recalculate karne ke liye
const calculateProductRating = async (productId) => {
  if (!productId) return;
  const reviews = await Review.find({ product: productId });

  let avgRating = 0;
  let count = reviews.length;

  if (count > 0) {
    avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / count;
  }

  await Product.findByIdAndUpdate(productId, {
    rating: avgRating,
    reviewCount: count,
  });
};

// @route   GET /api/reviews/myreviews
// @desc    Get logged in user's reviews
router.get("/myreviews", protect, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("product", "name image") // Product info bhi chahiye
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/reviews
router.post("/", protect, async (req, res) => {
  const { rating, comment, productId } = req.body;
  try {
    let reviewType = "website";
    let productData = null;

    if (productId) {
      productData = await Product.findById(productId);
      if (!productData)
        return res.status(404).json({ message: "Product not found" });
      reviewType = "product";
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId || null,
      rating: Number(rating),
      comment,
      reviewType,
    });

    if (productId) await calculateProductRating(productId);

    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: "Error creating review" });
  }
});

// @route   GET /api/reviews/admin
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate("user", "name email")
      .populate("product", "name image")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/reviews/website-featured
router.get("/website-featured", async (req, res) => {
  try {
    const reviews = await Review.find({
      reviewType: "website",
      isFeatured: true,
    })
      // ✅ FIX: 'avatar' add kiya taaki image bhi mile
      .populate("user", "name avatar")
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/reviews/:id (Update Review - User or Admin)
router.put("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check ownership (Admin sab kar sakta hai, User sirf apna)
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // User Edit Fields
    if (req.body.rating) review.rating = Number(req.body.rating);
    if (req.body.comment) review.comment = req.body.comment;

    // Admin Fields
    if (req.user.isAdmin) {
      if (req.body.adminReply !== undefined)
        review.adminReply = req.body.adminReply;
      if (req.body.isFeatured !== undefined)
        review.isFeatured = req.body.isFeatured;
      if (req.body.isLoved !== undefined) review.isLoved = req.body.isLoved;
    }

    await review.save();

    // Agar rating change hui hai aur ye product review hai, to recalculate karo
    if (review.product && req.body.rating) {
      await calculateProductRating(review.product);
    }

    res.json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/reviews/:id (User or Admin)
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check ownership
    if (
      review.user.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const productId = review.product; // Save ID before delete to recalculate
    await review.deleteOne();

    if (productId) {
      await calculateProductRating(productId);
    }

    res.json({ message: "Review removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
