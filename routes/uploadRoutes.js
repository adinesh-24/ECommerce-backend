const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { uploadSingleFile } = require("../controllers/uploadSingleFile");
const { uploadMultipleFile} = require("../controllers/uploadMultipleFile");

//its upload route for uploading file to server using multer middleware and upload function from uploadMiddleware.js
router.post("/upload", upload.single("image"), uploadSingleFile);
// uploadSingleFile is the controller function that will handle the file upload logic after multer middleware processes the file. ( by contoller response to client after file is uploaded successfully)
// "image" its upload.fields name  for frontend //upload.single("image") its middleware 

router.post(
  "/uploads",
  upload.array("images", 5), // max 5 files
  uploadMultipleFile
);


module.exports = router;