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
      telegram: { type: String, default: "#" },
      wechat: { type: String, default: "#" },
      zalo: { type: String, default: "#" },
    },

    whatsapp: {
      number: { type: String, default: "917047163936" },
      message: {
        type: String,
        default: "Hi, I'm interested in bulk hair orders.",
      },
    },

    productWhatsapp: {
      number: { type: String, default: "917047163936" },
      message: { type: String, default: "I am interested in this product: " },
    },

    telegram: {
      enabled: { type: Boolean, default: false },
      botToken: { type: String, default: "" },
      chatId: { type: String, default: "" },
    },

    mapUrl: {
      type: String,
      default: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d",
    },
  },
  { timestamps: true }
);

const SiteSettings = mongoose.model("SiteSettings", siteSettingsSchema);
module.exports = SiteSettings;
