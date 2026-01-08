const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  selectedDetails: {
    length: { type: String, required: true },
    color: { type: String, required: true },
    price: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["Pending", "Contacted"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 172800,
  },
});

const Quote = mongoose.model("Quote", quoteSchema);
module.exports = Quote;
