const mongoose = require("mongoose");
const Order = require("../models/Order");

// Aggregation: orders with user name, product name, shippingAddress, paymentStatus, quantity, bookingDate
const getOrderAggregation = async (req, res) => {
    try {
        const result = await Order.aggregate([

            // Join with users collection
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmpty: false } },

            // Unwind products array
            { $unwind: { path: "$products", preserveNullAndEmpty: false } },

            // Join with products collection
            {
                $lookup: {
                    from: "products",
                    localField: "products.productId",
                    foreignField: "_id",
                    as: "productDetail"
                }
            },
            { $unwind: { path: "$productDetail", preserveNullAndEmpty: false } },

            // Project the required fields
            {
                $project: {
                    _id: 1,
                    orderId: "$_id",
                    userId: "$user._id",
                    userName: "$user.username",
                    userEmail: "$user.email",
                    productId: "$productDetail._id",
                    productName: "$productDetail.title",
                    productPrice: "$productDetail.price",
                    quantity: "$products.quantity",
                    shippingAddress: 1,
                    paymentMethod: 1,
                    paymentStatus: 1,
                    status: 1,
                    bookingDate: "$createdAt",
                    updatedAt: 1
                }
            },

            // Sort by newest first
            { $sort: { bookingDate: -1 } }

        ]);

        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getOrderAggregation };
