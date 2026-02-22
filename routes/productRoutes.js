const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const roles = require('../middleware/roleMiddleware');
const upload = require("../middleware/uploadMiddleware");

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const { getCart } = require("../controllers/aggregateController");
const { addToCart, updateCart, deleteCartItem } = require("../controllers/addCart");
const { createOrder } = require("../controllers/orderController");

// ================= CART =================
router.get("/cart", verifyToken, getCart);
router.post("/cart", verifyToken, addToCart);
router.put("/cart/:id", verifyToken, updateCart);
router.delete("/cart/:id", verifyToken, deleteCartItem);

// ================= ORDER =================
router.post("/orders", verifyToken, createOrder);

// ================= PRODUCTS =================
router.get("/products", getProducts); // ✅ Fix for Cards.jsx
router.get("/products/:id", getProductById); // ✅ Fix for EditProduct.jsx
router.get("/", getProducts);
router.get("/:id", getProductById); // ✅ Fix for ViewProduct.jsx
router.post("/addProducts", verifyToken, roles("admin"), upload.single("image"), createProduct);
router.put("/updateProduct/:id", verifyToken, roles("admin"), upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", verifyToken, roles("admin"), deleteProduct);

module.exports = router;
