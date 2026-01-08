const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "Product",
    },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },

    isFeatured: { type: Boolean, default: false },
    adminReply: { type: String, default: "" },
    isLoved: { type: Boolean, default: false },

    reviewType: {
      type: String,
      enum: ["product", "website"],
      default: "product",
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
