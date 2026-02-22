const router = require("express").Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} = require("../controllers/addressController");

router.post("", verifyToken, addAddress);
router.get("/", verifyToken, getUserAddresses);
router.put("/:id", verifyToken, updateAddress);
router.delete("/:id", verifyToken, deleteAddress);
router.patch("/default/:id", verifyToken, setDefaultAddress);

module.exports = router;
