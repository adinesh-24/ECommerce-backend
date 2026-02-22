const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      },
      name: {
        type: String
      },
      quantity: {
        type: Number,
        default: 1
      }
    }
  ],

  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
    phone: String
  },

  status: {
    type: String,
    enum: ["pending", "approved", "processing", "shipped", "delivered"],
    default: "pending"
  },

  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "card"],
    default: "cod"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  bookingDate: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
