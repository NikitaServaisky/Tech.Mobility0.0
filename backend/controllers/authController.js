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
    const rawStep = req.body.step;
    const step = Number(rawStep);

    if (![1, 2].includes(step)) {
      return res.status(400).json({ message: "Invalid or missing step value", recevied: rawStep });
    }

    let extraData = {};
    if (req.body.extraData) {
      try {
        extraData = JSON.parse(req.body.extraData);
      } catch (err) {
        return res.status(400).json({ message: "Invalid extraData format" });
      }
    }

    if (step === 1) {
      if (!email || !password || !firstName || !lastName || !phone || !role) {
        return res.status(400).json({ message: "Missing required fields in step 1" });
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

    if (step === 2) {
      if (!req.body.userId) {
        return res.status(400).json({ message: "User ID is required for step 2" });
      }

      console.log("📥 Step 2 triggered with body:", req.body);
      console.log("📂 Uploaded Files:", req.files);
      if (req.files?.driverLicense?.[0]) {
        const file = req.files.driverLicense[0];
        console.log("📥 Driver License File Info:");
        console.log("• originalname:", file.originalname);
        console.log("• mimetype:", file.mimetype);
        console.log("• size:", file.size);
        console.log("• path:", file.path);
      } else {
        console.warn("⚠️ Driver License file is missing in req.files!");
      }      

      const user = await User.findById(req.body.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      let encryptedDriverLicensePath = null;
      let vehiclePhotoPath = null;

      if (req.files?.driverLicense?.[0]) {
        const driverLicenseFile = req.files.driverLicense[0];
        console.log("✅ Driver License File:", driverLicenseFile);
        console.log("Driver License mimetype:", driverLicenseFile.mimetype);
        const isValid = fileCheck(driverLicenseFile);
        if (!isValid) {
          return res.status(400).json({ message: "Invalid driver license file type." });
        }
        console.log("📁 Driver License path before encryption:", driverLicenseFile.path);

        encryptedDriverLicensePath = await encryptFile(driverLicenseFile.path);
      } else {
        return res.status(400).json({ message: "Missing driver license file." });
      }

      if (req.files?.vehiclePhoto?.[0]) {
        vehiclePhotoPath = req.files.vehiclePhoto[0].path;
      }

      let newUser;

      if (user.role === "driver") {
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
            vehicleColor: extraData.driverDetails.vehicleColor,
            bankDetails: {
              bankName: extraData.driverDetails.bankName,
              branchNumber: extraData.driverDetails.branchNumber,
              accountOwner: extraData.driverDetails.accountOwner,
            },
          },
          driverLicense: encryptedDriverLicensePath,
          vehiclePhoto: vehiclePhotoPath || null,
        });

        await User.findByIdAndDelete(user._id);
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

      return res.status(400).json({ message: "Unsupported role for step 2" });
    }

    return res.status(400).json({ message: "Invalid step" });
  } catch (err) {
    console.error("❌ Error in registration:", err);
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

module.exports = {
  userLogin,
  registerUser,
};
