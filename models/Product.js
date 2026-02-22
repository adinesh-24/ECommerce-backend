const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    category: {
    type: String,
    required: true,
category: {
  type: String,
  enum: [
    "mobile",
    "laptop",
    "tablet",
    "smartwatch",
    "accessories",
    "headphones",
    "camera",
    "gaming",
    "monitor",
    "keyboard",
    "mouse",
    "speaker",
    "tv",
    "electronics",
    "home-appliances",
    "wearables",
    "storage-devices",
    "networking"
  ],
  required: true
}
  },

    image: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Product", productSchema);
