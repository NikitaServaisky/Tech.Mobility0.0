const fileCheck = (file) => {
  const validTypes = ["image/jpeg", "image/jpg", "image/png"];
  return file && validTypes.includes(file.mimetype);
};

module.exports = { fileCheck };

