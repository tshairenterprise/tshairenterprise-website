const express = require("express");
const router = express.Router();
const Quote = require("../models/Quote");
const SiteSettings = require("../models/SiteSettings");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ Helper: Telegram ko message bhejna (Node 18+ global fetch use)
async function sendTelegramQuoteNotification(populatedQuote) {
  try {
    const settings = await SiteSettings.findOne();
    const tg = settings?.telegram;

    if (!tg || !tg.enabled || !tg.botToken || !tg.chatId) {
      // Telegram disabled ya config incomplete – silently skip
      return;
    }

    const user = populatedQuote.user || {};
    const product = populatedQuote.product || {};
    const sel = populatedQuote.selectedDetails || {};

    const text =
      `🧾 *New Quote Request Received*\n\n` +
      `👤 *Customer*: ${user.name || "Unknown"}\n` +
      `📧 Email: ${user.email || "-"}\n` +
      `📱 WhatsApp: ${user.whatsappNumber || "-"}\n\n` +
      `💇‍♀️ *Product*: ${product.name || "Unknown Product"}\n` +
      `📏 Length: ${sel.length || "-"}\n` +
      `🎨 Shade: ${sel.color || "-"}\n` +
      `💰 Price Idea: ${sel.price || "-"}\n\n` +
      `⏱ Status: ${populatedQuote.status || "Pending"}\n` +
      `🕒 Auto-expire in 48 hours.\n\n` +
      `Reply to this customer via WhatsApp or Email.`;

    const url = `https://api.telegram.org/bot${tg.botToken}/sendMessage`;

    // Node 18+ me global fetch hota hai
    if (typeof fetch !== "function") {
      console.error(
        "⚠️ Telegram notify skipped: fetch is not available in this Node version."
      );
      return;
    }

    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: tg.chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("❌ Telegram notification error:", err.message);
  }
}

// @route   POST /api/quotes
// @desc    User submits a quote request
// @access  Private (Login Required)
router.post("/", protect, async (req, res) => {
  try {
    const { productId, selectedDetails } = req.body;

    if (!productId || !selectedDetails) {
      return res.status(400).json({ message: "Missing product or selection" });
    }

    const quote = await Quote.create({
      user: req.user._id,
      product: productId,
      selectedDetails,
    });

    const populated = await quote.populate([
      { path: "user", select: "name email whatsappNumber" },
      { path: "product", select: "name image name" },
    ]);

    // Pehle user ko turant response
    res
      .status(201)
      .json({ message: "Quote Requested Successfully", quote: populated });

    // Phir background me Telegram pe notification (fire & forget)
    sendTelegramQuoteNotification(populated).catch(() => {});
  } catch (error) {
    console.error("Quote Error:", error);
    res.status(400).json({ message: "Failed to submit quote" });
  }
});

// @route   GET /api/quotes/admin
// @desc    Get all active quotes (Admin Only)
// @access  Private/Admin
router.get("/admin", protect, admin, async (req, res) => {
  try {
    const quotes = await Quote.find({})
      .populate("user", "name email whatsappNumber")
      .populate("product", "name image")
      .sort({ createdAt: -1 });

    res.json(quotes);
  } catch (error) {
    console.error("Quotes fetch error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/quotes/:id/status
// @desc    Mark quote as Contacted / Pending (Admin)
// @access  Private/Admin
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Contacted"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: "Quote not found" });
    }

    quote.status = status;
    await quote.save();

    const populated = await quote.populate([
      { path: "user", select: "name email whatsappNumber" },
      { path: "product", select: "name image name" },
    ]);

    res.json(populated);
  } catch (error) {
    console.error("Quote status update error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
