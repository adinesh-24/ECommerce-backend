const Address = require("../models/Address");
const AppError = require("../utils/appError");


// ✅ Add new address
exports.addAddress = async (req, res, next) => {

  try {

    const userId = req.user.id; // from verifyToken middleware

    const address = await Address.create({
      userId,
      ...req.body
    });

    res.status(201).json(address);

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


// ✅ Get all addresses of logged user
exports.getUserAddresses = async (req, res, next) => {

  try {

    const userId = req.user.id;

    const addresses = await Address.find({ userId });

    res.json(addresses);

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


// ✅ Update address
exports.updateAddress = async (req, res, next) => {

  try {

    const userId = req.user.id;
    const { id } = req.params;

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId },
      req.body,
      { new: true }
    );

    if (!updated) {
      return next(new AppError("Address not found", 404));
    }

    res.json(updated);

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


// ✅ Delete address
exports.deleteAddress = async (req, res, next) => {

  try {

    const userId = req.user.id;
    const { id } = req.params;

    const deleted = await Address.findOneAndDelete({
      _id: id,
      userId
    });

    if (!deleted) {
      return next(new AppError("Address not found", 404));
    }

    res.json({ message: "Address deleted successfully" });

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};


// ⭐ BONUS — Set Default Address (Senior Feature)
exports.setDefaultAddress = async (req, res, next) => {

  try {

    const userId = req.user.id;
    const { id } = req.params;

    // remove existing default
    await Address.updateMany(
      { userId },
      { isDefault: false }
    );

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      { isDefault: true },
      { new: true }
    );

    res.json(address);

  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
