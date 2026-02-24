const mongoose = require("mongoose");

mongoose.set("strictQuery", false); // to avoid deprecation warning for strictQuery in Mongoose 7

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Atlas Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
