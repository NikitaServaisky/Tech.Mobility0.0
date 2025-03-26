const fileCheck = (req, user) => {
  if (req.file) {
    console.log("✅ File detected:", req.file.filename);
    fileCheck(req, newUser);
  } else {
    console.log("⚠️ No file uploaded.");
  }
};

module.exports = { fileCheck };
