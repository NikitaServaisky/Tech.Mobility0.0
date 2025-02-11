const multer = require("multer");
const path = require("path");

//set storage upload 
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

//checking type of file
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "businessLicense") {
    if (file.mimetype === "application/pdf" || file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDFand image files are allowed for business lecense"), fale);
    }
  } else {
    cb(null, true);
  }
};

//file size limits
const limits = {
  fileSize: 5 * 1024 * 1024
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
