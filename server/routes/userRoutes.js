const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const stream = require("stream");

// --- Configuration ---

// 1. SendGrid Config
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.warn("⚠️ SendGrid API Key missing - Emails will not send.");
}

// 2. Cloudinary Config
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
} else {
  console.warn("⚠️ Cloudinary Keys missing – avatar upload disabled.");
}

// --- Helpers & Middleware ---

// Multer (memory storage for uploads)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ✅ JWT Token Generator (Critical Helper)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Helper: Extract Public ID from Cloudinary URL (for deletion)
const getPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    if (!url.includes("cloudinary")) return null;
    const parts = url.split("/");
    const filename = parts.pop();
    const folder = parts.pop();
    return `${folder}/${filename.split(".")[0]}`;
  } catch {
    return null;
  }
};

// Helper: Upload Buffer to Cloudinary
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "ts-hair-users", resource_type: "auto" },
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

// ============================================================================
//                                AUTH ROUTES
// ============================================================================

// @route   POST /api/users/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        avatar: user.avatar,
        whatsappNumber: user.whatsappNumber,
        token: generateToken(user._id),
      });
    }

    return res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   POST /api/users
router.post("/", async (req, res) => {
  try {
    const { name, email, password, whatsappNumber } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const userCount = await User.countDocuments({});
    const isAdmin = userCount === 0; // First user is Admin automatically

    const user = await User.create({
      name,
      email,
      password,
      isAdmin,
      whatsappNumber,
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      whatsappNumber: user.whatsappNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (Name, Password, Avatar, WhatsApp)
router.put("/profile", protect, upload.single("avatar"), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = req.body.name || user.name;
    if (req.body.whatsappNumber) user.whatsappNumber = req.body.whatsappNumber;

    if (req.body.password && req.body.password.trim() !== "") {
      user.password = req.body.password;
    }

    // Avatar Upload Logic
    if (req.file) {
      // Check Cloudinary Config first
      if (cloudinary.config().cloud_name) {
        // Delete old avatar if exists
        if (user.avatar) {
          const publicId = getPublicIdFromUrl(user.avatar);
          if (publicId) {
            await cloudinary.uploader
              .destroy(publicId)
              .catch((err) =>
                console.warn("Old avatar delete failed:", err.message)
              );
          }
        }
        // Upload new avatar
        const imageUrl = await uploadToCloudinary(req.file.buffer);
        user.avatar = imageUrl;
      }
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      avatar: updatedUser.avatar,
      whatsappNumber: updatedUser.whatsappNumber,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error("Profile Update Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ============================================================================
//                              PASSWORD RESET ROUTES
// ============================================================================

// @route   POST /api/users/forgotpassword
router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email" });
    }

    // Generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Hash token and save to DB
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expire in 10 minutes
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // ✅ FIX: Dynamic Client URL for Production
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/resetpassword/${resetToken}`;

    const msg = {
      to: user.email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: "Reset Your Password - TS Hair Enterprise",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <h2 style="color: #6d28d9;">TS Hair Enterprise</h2>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px;">
                <h3 style="color: #111827;">Password Reset Request</h3>
                <p style="color: #4b5563; font-size: 16px;">
                    Hello ${user.name},
                </p>
                <p style="color: #4b5563; font-size: 14px; line-height: 1.5;">
                    You recently requested to reset your password for your TS Hair Enterprise account. Click the button below to proceed.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #7c3aed; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p style="color: #6b7280; font-size: 12px;">
                    If you did not request this, please ignore this email or contact support.
                </p>
                <p style="color: #6b7280; font-size: 12px;">
                    This link will expire in 10 minutes.
                </p>
            </div>
        </div>
      `,
    };

    try {
      await sgMail.send(msg);
      res.status(200).json({ success: true, data: "Email Sent Successfully" });
    } catch (emailError) {
      console.error("SendGrid Error:", emailError);

      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();

      // Dev Fallback
      console.log("---------------------------------------");
      console.log("DEV RESET LINK (Email Failed):", resetUrl);
      console.log("---------------------------------------");

      return res.status(500).json({
        message: "Email could not be sent. Check console for Dev Link.",
      });
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   PUT /api/users/resetpassword/:resetToken
// @desc    Verify token, update password AND return full user object
router.put("/resetpassword/:resetToken", async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or Expired Token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    // ✅ Return Full User Object with Token (Auto Login after Reset)
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      avatar: user.avatar,
      whatsappNumber: user.whatsappNumber,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// @route   GET /api/users/admin-exists
// @desc    Check if any admin user exists (Used for initial setup)
router.get("/admin-exists", async (req, res) => {
  try {
    const adminCount = await User.countDocuments({ isAdmin: true });
    res.json({ exists: adminCount > 0 });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
