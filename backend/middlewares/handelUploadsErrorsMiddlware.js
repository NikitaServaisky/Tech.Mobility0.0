const multer = require('multer');

const handleUploadsErrorsMiddlware = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // multer error like ti large file
        let message = "Upload error";

        if (err.code === "LIMIT_FILE_SIZE") {
            message = "file is to large. Maz 5MB allowed";
        }

        return res.status(400).json({
            status: 'error',
            message,
        });
    }

    if (err) {
        // something error
        return res.status(400).json({
            status: "error",
            message: err.maessage || "Unknow error during file upload."
        });
    }

    next();
} 

module.exports = handleUploadsErrorsMiddlware;