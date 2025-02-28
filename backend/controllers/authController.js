const User = require("../models/userBaseSchema");
const Customer = require("../models/customerSchema");
const Driver = require("../models/driverSchema");
const Organization = require("../models/organizationSchema");
const { hashPassword, encryptFile, encryptData } = require("../utils/security");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_WORD,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({
        message: "Login successful",
        token,
        userId: user._id,
        role: user.role,
      });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in user" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { step, email, password, firstName, lastName, phone, role, extraData } = req.body;
    let user;

    if (step === 1) {
      // Step 1: Base user registration
      if (!email || !password || !firstName || !lastName || !phone || !role) {
        return res.status(400).json({ message: "Missing required fields in step 1" });
      }

      const hashedPassword = await hashPassword(password);

      user = new User({ email, password: hashedPassword, firstName, lastName, phone, role });
      await user.save();

      return res.status(201).json({ message: "Step 1 completed. Proceed to step 2", userId: user._id });
    }

    if (step === 2) {
      // Step 2: Additional role-specific details
      user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      switch (user.role) {
        case "customer":
          if (!extraData?.paymentDetails) return res.status(400).json({ message: "Missing payment details" });

          const customer = new Customer({
            ...user.toObject(),
            paymentDetails: {
              cardHolderName: extraData.paymentDetails.cardHolderName,
              cardNumber: encryptData(extraData.paymentDetails.cardNumber),
              expiryDate: encryptData(extraData.paymentDetails.expiryDate),
              cvv: encryptData(extraData.paymentDetails.cvv),
            },
          });

          await customer.save();
          break;

        case "driver":
          if (!extraData?.driverDetails) return res.status(400).json({ message: "Missing driver details" });

          const encryptedDriverLicense = encryptFile(req.file?.path || "");
          const driver = new Driver({
            ...user.toObject(),
            driverDetails: {
              ...extraData.driverDetails,
              driverLicense: encryptedDriverLicense,
            },
          });

          await driver.save();
          break;

        case "organization":
          if (!extraData?.businessLicense || !extraData?.organizationName) {
            return res.status(400).json({ message: "Missing organization details" });
          }

          const encryptedBusinessLicense = encryptFile(req.file?.path || "");
          const organization = new Organization({
            ...user.toObject(),
            organizationName: extraData.organizationName,
            address: extraData.address,
            taxId: extraData.taxId,
            contactPerson: extraData.contactPerson,
            businessLicense: encryptedBusinessLicense,
          });

          await organization.save();
          break;

        default:
          return res.status(400).json({ message: "Invalid role" });
      }

      return res.status(201).json({ message: "Registration completed", userId: user._id, role: user.role });
    }

    res.status(400).json({ message: "Invalid step" });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

module.exports = {
  userLogin, registerUser
};
