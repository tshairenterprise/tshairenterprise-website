const express = require("express");
const router = express.Router();
const Faq = require("../models/Faq");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/faqs
// @desc    Get all active FAQs (Public)
router.get("/", async (req, res) => {
  try {
    const faqs = await Faq.find({ isActive: true }).sort({ createdAt: 1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/faqs/admin
// @desc    Get ALL FAQs (Admin)
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const faqs = await Faq.find({}).sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/faqs
// @desc    Create FAQ (Admin)
router.post("/", protect, admin, async (req, res) => {
  try {
    const faq = await Faq.create(req.body);
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ message: "Invalid Data" });
  }
});

// @route   PUT /api/faqs/:id
// @desc    Update FAQ (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const faq = await Faq.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: "Update Failed" });
  }
});

// @route   DELETE /api/faqs/:id
// @desc    Delete FAQ (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Faq.deleteOne({ _id: req.params.id });
    res.json({ message: "FAQ Removed" });
  } catch (error) {
    res.status(500).json({ message: "Delete Failed" });
  }
});

module.exports = router;
