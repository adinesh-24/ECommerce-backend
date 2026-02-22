// const { get } = require("../config/mail.config");
const Cart = require("../models/Cart");
const AppError = require("../utils/appError");

const addToCart = async (req, res,next) => {

  try {

    const userId = req.user.id; // from verifyToken middleware
    const { productId, quantity } = req.body;

    // check if already in cart
    let cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      // increase quantity
      cartItem.quantity += quantity || 1;
      await cartItem.save();

      return res.json({
        message: "Cart updated",
        data: cartItem
      });
    }

    // create new cart item
    const newCart = await Cart.create({
      userId,
      productId,
      quantity: quantity || 1
    });

    res.json({
      message: "Added to cart",
      data: newCart
    });

  } catch (error) {

    return next(new AppError(error.message, 500));
  }

};


//update cart item quantity

const updateCart = async (req, res) => {

  try {

    const userId = req.user.id;
    const cartId = req.params.id;
    const { quantity } = req.body;

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cartId, userId }, // security check
      { quantity },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "Cart updated",
      data: updatedCart
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};


//delete cart item
const deleteCartItem = async (req, res) => {

  try {

    const userId = req.user.id;
    const cartId = req.params.id;

    const deleted = await Cart.findOneAndDelete({
      _id: cartId,
      userId
    });

    if (!deleted) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({
      message: "Cart item removed"
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }

};

module.exports = {addToCart, updateCart, deleteCartItem};