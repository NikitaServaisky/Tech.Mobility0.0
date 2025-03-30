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
  if (!process.env.ENCRYPTION_KEY) {
    throw new Error("Missing ENCRYPTION_KEY in .env");
  }  
  try {
    console.log("🔐 Starting encryption for:", filePath);
    const fileData = await fs.readFile(filePath);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    const encryptedData = Buffer.concat([
      cipher.update(fileData),
      cipher.final(),
    ]);
    const encryptedFile = Buffer.concat([iv, encryptedData]);
    const encryptedFilePath = filePath + ".enc";
    await fs.writeFile(encryptedFilePath, encryptedFile);
    console.log("✅ File encrypted and saved at:", encryptedFilePath);
    return encryptedFilePath;
  } catch (err) {
    console.error("❌ Encryption error:", err);
    throw new Error("file encryption failed: " + err.message);
  }
};


const encryptData = (data) => {
  const algorithm = "aes-256-cbc";

  let key = process.env.ENCRYPTION_KEY || "";
  if (key.length < 32) {
    key = key.padEnd(32, " ");
  } else if (key.length > 32) {
    key = key.substring(0, 32);
  }
  const keyBuffer = Buffer.from(key, "utf-8");

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, keyBuffer, iv);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + "-" + encrypted;
};

module.exports = { hashPassword, encryptFile, encryptData };
