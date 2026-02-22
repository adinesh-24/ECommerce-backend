const Product = require("../models/Product");
const AppError = require('../utils/appError');

// GET /products?category=mobile&search=iphone
// GET /products?category=mobile&search=iphone
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" }; // Case insensitive search
    }


    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    return new AppError(error.message, 500);
  }
};

// GET /products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// POST /products
exports.createProduct = async (req, res) => {
  try {
    const { title, price, category, description } = req.body;

    const savedProduct = await Product.create({
      title,
      price,
      category,
      description,
      image: req.file ? req.file.path : ""
    });

    res.status(201).json(savedProduct);
  } catch (error) {
    return new AppError(error.message, 400);
  }
};

// PUT /products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedData = {
      title: req.body.title,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description
    };

    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, // id to find the product
      updatedData,
      { new: true } // to return the updated document
    );

    if (!updatedProduct) {
      return new AppError("Product not found", 404);
    }

    res.json(updatedProduct);
  } catch (error) {
    return new AppError(error.message, 400);
  }
};

// DELETE /products/:id
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return new AppError("Product not found", 404);
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    return new AppError(error.message, 500);
  }
};


// //upload
// try