const uploadMultipleFile = (req, res, next) => {

  console.log("files", req.files);

  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded"
      });
    }

    // format response
    // format response
    const uploadedFiles = req.files.map(file => ({
      fileName: file.filename,
      originalName: file.originalname,
      size: file.size,
      url: file.path,
      path: file.path
    }));

    // success response to client after files are uploaded successfully
    res.status(200).json({
      message: "Files uploaded successfully",
      files: uploadedFiles
    });
  } catch (error) {

    console.error("File upload error:", error);

    res.status(500).json({
      message: error.message
    });

  }
};

module.exports = { uploadMultipleFile };
