const express = require("express");
const router = express.Router();

// Controller
const orderController = require("../controllers/orderController");

// Middlewares
const verifyToken = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/roleMiddleware");



/*
==================================
            USER ROUTES
==================================
*/


// Create new order
// POST /api/orders
router.post(
  "/",
  verifyToken,
  orderController.createOrder
);


// Get logged-in user orders
// GET /api/orders/my-orders
router.get(
  "/my-orders",
  verifyToken,
  orderController.getUserOrders
);



/*
==================================
            ADMIN ROUTES
==================================
*/


// Get all orders (Admin only)
// GET /api/orders
router.get(
  "/",
  verifyToken,
  verifyAdmin("admin"),
  orderController.getAllOrders
);


// Update order status (Admin only)
// PUT /api/orders/:id/status
router.put(
  "/:id/status",
  verifyToken,
  verifyAdmin("admin"),
  orderController.updateOrderStatus
);



// Get order aggregation (Admin only)
// GET /order/aggregation
const { getOrderAggregation } = require("../controllers/orderAggregateController");
router.get(
  "/aggregation",
  verifyToken,
  verifyAdmin("admin"),
  getOrderAggregation
);

module.exports = router;

