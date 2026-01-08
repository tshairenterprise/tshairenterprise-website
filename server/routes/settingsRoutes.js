const express = require("express");
const router = express.Router();
const SiteSettings = require("../models/SiteSettings");
const { protect, admin } = require("../middleware/authMiddleware");

// @route   GET /api/settings
// @desc    Get Site Settings (Public)
router.get("/", async (req, res) => {
  try {
    // Hamesha pehla document find karo
    let settings = await SiteSettings.findOne();

    // Agar settings nahi mili (First time run), to default create kar do
    if (!settings) {
      settings = await SiteSettings.create({});
    }

    res.json(settings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/settings
// @desc    Update Settings (Admin Only)
router.put("/", protect, admin, async (req, res) => {
  try {
    // findOneAndUpdate with upsert: true (create if not exists)
    // Hum empty object {} pass kar rahe hain taaki wo pehla document hi update kare
    const updatedSettings = await SiteSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });

    res.json(updatedSettings);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Update Failed" });
  }
});

module.exports = router;
