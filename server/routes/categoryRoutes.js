const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/categories
// @desc    Get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/categories
// @desc    Create category (Admin)
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Invalid category data" });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category (Admin)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete category (Admin)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Category.deleteOne({ _id: req.params.id });
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
