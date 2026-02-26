const Order = require("../models/Order");
const User = require("../models/User");
const { sendOrderConfirmation } = require("../utils/emailService");


// ================= USER =================

// Create Order (always pending)
exports.createOrder = async (req, res) => {
  try {

    const order = new Order({
      userId: req.user.id,
      products: req.body.products,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod || "cod",
      status: "pending"
    });

    const saved = await order.save();

    // Populate products for email
    const populated = await saved.populate("products.productId");

    // Send confirmation email (non-blocking)
    User.findById(req.user.id).then(user => {
      if (!user?.email) return;
      const total = populated.products.reduce(
        (s, item) => s + (item.productId?.price || 0) * (item.quantity || 1), 0
      );
      sendOrderConfirmation({
        toEmail: user.email,
        username: user.username || user.email,
        orderId: saved._id,
        products: populated.products,
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod || "cod",
        total
      }).catch(err => console.error("Email error:", err.message));
    });

    res.status(201).json({ ...saved.toObject(), emailSent: true });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get user orders
exports.getUserOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      userId: req.user.id
    })
      .populate("userId", "username email")
      .populate("products.productId") // ⭐ show product details
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ================= ADMIN =================

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("userId", "username email") // ⭐ user details only
      .populate("products.productId")   // ⭐ product details
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// STRICT STATUS FLOW
const statusFlow = [
  "pending",
  "approved",
  "processing",
  "shipped",
  "delivered"
];



// Update order status (ADMIN)
exports.updateOrderStatus = async (req, res) => {
  try {

    const { status } = req.body;

    // check valid status
    if (!statusFlow.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    // strict flow validation
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(status);

    if (newIndex < currentIndex) {
      return res.status(400).json({
        message: "Cannot move status backward"
      });
    }

    order.status = status;

    await order.save();

    // populate response
    const updatedOrder = await Order.findById(order._id)
      .populate("userId", "username email")
      .populate("products.productId");

    res.json(updatedOrder);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
