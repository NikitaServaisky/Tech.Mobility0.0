const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const fs = require("fs").promises;

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const encryptFile = async (filePath) => {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(16);
  try {
    const fileData = await fs.readFile(filePath);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encryptedData = Buffer.concat([
      cipher.update(fileData),
      cipher.final(),
    ]);
    const encryptedFile = Buffer.concat([iv, encryptedData]);
    const encryptedFilePath = filePath + " .enc";
    await fs.writeFile(encryptedFilePath, encryptedFile);
    return encryptedFilePath;
  } catch (err) {
    throw new Error("file encryption failed: " + err.massege);
  }
};

const encryptData = (data) => {
  const algorithm = "aes-256-cbc";
  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + "-" + encrypted;
};

module.exports = { hashPassword, encryptFile, encryptData };
