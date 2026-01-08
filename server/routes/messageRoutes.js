const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const SiteSettings = require("../models/SiteSettings");
const { protect, admin } = require("../middleware/authMiddleware");

// ✅ Helper: Telegram ko message bhejna
async function sendTelegramMessageNotification(messageData) {
    try {
        const settings = await SiteSettings.findOne();
        const tg = settings?.telegram;

        if (!tg || !tg.enabled || !tg.botToken || !tg.chatId) {
            // Telegram disabled ya config incomplete – silently skip
            return;
        }

        const text =
            `📧 *New Contact Form Submission*\n\n` +
            `👤 *Customer*: ${messageData.name}\n` +
            `📧 Email: ${messageData.email}\n` +
            `📱 WhatsApp: ${messageData.whatsappNumber}\n\n` +
            `📝 *Subject*: ${messageData.subject || "No Subject"}\n` +
            `💬 *Message*: ${messageData.message.substring(0, 150)}...\n\n` +
            `Action Required: Reply via Email or WhatsApp.`;

        const url = `https://api.telegram.org/bot${tg.botToken}/sendMessage`;

        // Node 18+ me global fetch hota hai
        if (typeof fetch !== "function") {
            console.error("⚠️ Telegram notify skipped: fetch is not available in this Node version.");
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
        console.error("❌ Telegram notification error for message:", err.message);
    }
}

// @route   POST /api/messages
// @desc    User submits a new contact message
// @access  Public
router.post("/", async (req, res) => {
  // ✅ ADDED userId TO DESTRUCTURE
  const { name, email, whatsappNumber, subject, message, userId } = req.body;

  // Basic validation
  if (!name || !email || !whatsappNumber || !message) {
    return res
      .status(400)
      .json({ message: "Please fill all required fields." });
  }

  try {
    const newMessage = await Message.create({
      // ✅ CONDITIONAL USER ID
      user: userId || null,
      name,
      email,
      whatsappNumber,
      subject,
      message,
    });

    res.status(201).json({
      message: "Message sent successfully!",
      messageId: newMessage._id,
    });

    // Send Telegram Notification (Fire and forget)
    sendTelegramMessageNotification(newMessage).catch(() => {});
  } catch (error) {
    console.error("Contact Form Submission Error:", error);
    res.status(500).json({ message: "Server error during submission." });
  }
});

// @route   GET /api/messages
// @desc    Get all contact messages (Admin Only)
// @access  Private/Admin
router.get("/", protect, admin, async (req, res) => {
  try {
    // Fetch all messages, newest first, and POPULATE the user details
    const messages = await Message.find({})
      .populate("user", "name email avatar") // ✅ POPULATE AVATAR
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.status(500).json({ message: "Server error while fetching messages." });
  }
});

// @route   PATCH /api/messages/:id/read
// @desc    Mark a message as read/unread (Admin Only)
router.patch("/:id/read", protect, admin, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    message.isRead =
      req.body.isRead !== undefined ? req.body.isRead : !message.isRead;
    await message.save();

    res.json(message);
  } catch (error) {
    console.error("Mark Read Error:", error);
    res.status(500).json({ message: "Server error during update." });
  }
});

module.exports = router;
