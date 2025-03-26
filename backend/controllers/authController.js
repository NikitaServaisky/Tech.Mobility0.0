const User = require("../models/userBaseSchema");
const Customer = require("../models/customerSchema");
const Driver = require("../models/driverSchema");
const Organization = require("../models/organizationSchema");
const { hashPassword, encryptFile, encryptData } = require("../utils/security");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { fileCheck } = require("../utils/fileChecker");
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

    const authToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET_WORD,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      authToken,
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
    let { email, password, firstName, lastName, phone, role } = req.body;
    let step = parseInt(req.body.step, 10) || 0;

    let extraData = {};
    if (req.body.extraData) {
      try {
        extraData = JSON.parse(req.body.extraData);
      } catch (err) {
        return res.status(400).json({ message: "Invalid extraData format" });
      }
    }

    // ✅ Step 1: Store Basic User Info
    if (step === 1) {
      if (!email || !password || !firstName || !lastName || !phone || !role) {
        return res
          .status(400)
          .json({ message: "Missing required fields in step 1" });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role,
      });

      await user.save();

      return res.status(201).json({
        message: "Step 1 completed. Proceed to step 2",
        userId: user._id,
      });
    }

    // ✅ Step 2: Store Additional Details Based on Role
    if (step === 2) {
      if (!req.body.userId) {
        return res
          .status(400)
          .json({ message: "User ID is required for step 2" });
      }

      const user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      // ✅ Check file type if file exists
      if (req.file) {
        const isValid = fileCheck(req.file);
        if (!isValid) {
          return res
            .status(400)
            .json({ message: "Invalid file type uploaded." });
        }
      }

      let newUser;
      await User.findByIdAndDelete(user._id);

      let encryptedFilePath = null;
      const fileIsSensitive =
        user.role === "organization" || user.role === "driver";

      if (req.file && fileIsSensitive) {
        encryptedFilePath = await encryptFile(req.file.path); // 🔐 Encrypt sensitive file
      }

      switch (user.role) {
        case "customer":
          if (!extraData?.paymentDetails) {
            return res.status(400).json({ message: "Missing payment details" });
          }

          newUser = new Customer({
            _id: user._id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            paymentDetails: {
              cardHolderName: extraData.paymentDetails.cardHolderName,
              cardNumber: encryptData(extraData.paymentDetails.cardNumber),
              expiryDate: encryptData(extraData.paymentDetails.expiryDate),
              cvv: encryptData(extraData.paymentDetails.cvv),
            },
            profilePicture: req.file ? req.file.path : null, // Not encrypted
          });
          break;

        case "driver":
          if (!extraData?.driverDetails) {
            return res.status(400).json({ message: "Missing driver details" });
          }

          newUser = new Driver({
            _id: user._id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            driverDetails: {
              licenseNumber: extraData.driverDetails.licenseNumber,
              vehicleMake: extraData.driverDetails.vehicleMake,
              vehicleModel: extraData.driverDetails.vehicleModel,
              vehicleYear: extraData.driverDetails.vehicleYear,
              vehiclePlate: extraData.driverDetails.vehiclePlate,
            },
            bankDetails: {
              bankName: extraData.driverDetails.bankName,
              branchNumber: extraData.driverDetails.branchNumber,
              accountHolderName: extraData.driverDetails.accountHolderName,
            },
            driverLicense: encryptedFilePath || null,
          });
          break;

        case "organization":
          if (!extraData?.organizationDetails) {
            return res
              .status(400)
              .json({ message: "Missing organization details" });
          }

          newUser = new Organization({
            _id: user._id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            organizationDetails: {
              organizationName: extraData.organizationDetails.organizationName,
              address: extraData.organizationDetails.address,
              taxId: extraData.organizationDetails.taxId,
              contactPerson: extraData.organizationDetails.contactPerson,
              businessLicense: encryptedFilePath || null,
            },
          });
          break;

        default:
          return res.status(400).json({ message: "Invalid role" });
      }

      console.log("🔍 Final newUser object before save:", newUser);
      await newUser.save();

      const authToken = jwt.sign(
        { userId: newUser._id, role: newUser.role },
        process.env.JWT_SECRET_WORD,
        { expiresIn: "24h" }
      );

      return res.status(201).json({
        message: "Registration completed",
        userId: newUser._id,
        role: newUser.role,
        token: authToken,
      });
    }

    return res.status(400).json({ message: "Invalid step" });
  } catch (err) {
    console.error("Error in registration:", err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

module.exports = {
  userLogin,
  registerUser,
};
