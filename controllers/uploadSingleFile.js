
// const AppError = require("../utils/appError");
// exports.uploadSingleFile = (req, res,next) => {
const uploadSingleFile = (req, res, next) => {
    console.log("file", req.file);
    try {
        if (!req.file) {
            // If no file is uploaded, return an error response
            // return next (new AppError("No file uploaded", 400)); inhert
            return res.status(400).json({ message: "No file uploaded" });
        }
        //success response to client after file is uploaded successfully 
        res.status(200).json({
            message: "File uploaded successfully",
            fileName: req.file.filename,
            pathName: req.file.originalname,
            url: req.file.path,
            size: req.file.size
        });
    } catch (error) {
        // Handle any errors that occur during file upload 
        res.status(500).json({ message: error.message });
        console.error("File upload error:", error);
    }
}

module.exports = { uploadSingleFile };