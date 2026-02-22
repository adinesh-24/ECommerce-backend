const multer = require("multer");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage }); //export upload middleware

module.exports = upload; 