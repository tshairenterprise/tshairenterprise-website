const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    email: { type: String, default: "support@tshairenterprise.com" },
    phone: { type: String, default: "+91 70471 63936" },
    address: {
      type: String,
      default: "Beldanga, Murshidabad, West Bengal, India - 742133",
    },

    socials: {
      facebook: { type: String, default: "#" },
      instagram: { type: String, default: "#" },
      twitter: { type: String, default: "#" },
      youtube: { type: String, default: "#" },
      telegram: { type: String, default: "#" }, // public channel / profile
      wechat: { type: String, default: "#" },
      zalo: { type: String, default: "#" },
    },

    whatsapp: {
      number: {
        type: String,
        default: "917047163936",
      },
      message: {
        type: String,
        default: "Hi, I'm interested in bulk hair orders.",
      },
    },

    telegram: {
      enabled: { type: Boolean, default: false },
      botToken: { type: String, default: "" },
      chatId: { type: String, default: "" },
    },

    // Google Map Embed URL
    mapUrl: {
      type: String,
      default:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3664.116655933491!2d88.24726507604896!3d23.93801257854322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f9adc1e6b7b0a1%3A0x1c3c5a0a5c5a0a0a!2sBeldanga!5e0!3m2!1sen!2sin!4v1625561234567!5m2!1sen!2sin",
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
module.exports = SiteSettings;
