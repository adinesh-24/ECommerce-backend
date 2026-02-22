const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  productId: mongoose.Schema.Types.ObjectId,

  // user selected quantity
  quantity: {
    type: Number,
    default: 1
  }
});
module.exports = mongoose.model("Cart", cartSchema);