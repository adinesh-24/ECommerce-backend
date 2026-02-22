const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const path = require("path");


dotenv.config();
connectDB();

//need to serve static files from uploads folder after complete the multer file upload
// Example : http://localhost:5000/uploads/1770370501290.jpg

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("Static files served from:", path.join(__dirname, "uploads"));


app.use(cors());

//  JSON only for JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static images
// app.use("/uploads", express.static("uploads"));

app.use("/img", require("./routes/uploadRoutes"));

app.use("/order", require("./routes/orderRoutes"));
//address route /
app.use("/address/", require("./routes/addressRoutes"));
// Routes
app.use("/", require("./routes/productRoutes"));

app.use("/api/", require("./routes/userRoutes"));

app.use("/mailer", require("./routes/mailerRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


//global error handling middleware
// Global error handler
app.use((err, req, res, next) => {

  console.error(err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error"
  });

});
