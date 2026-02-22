const mongoose = require("mongoose");
const Cart = require("../models/Cart");

const getCart = async (req, res) => {
  try {

    const userId = req.user.id;

    const cart = await Cart.aggregate([

      // match user cart
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },

      // join product data
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product"
        }
      },

      // convert array to object
      {
        $unwind: "$product"
      },

      // add price and total price
      {
        $addFields: {
          price: "$product.price",
          totalPrice: {
            $multiply: ["$quantity", "$product.price"]
          }
        }
      }

    ]);

    res.json(cart);

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

module.exports = { getCart };
