const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  fullName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String

});

module.exports = mongoose.model("Address", addressSchema);
