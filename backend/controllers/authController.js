const crypto = require("crypto");
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
      .json({ message: "Login successful", token, userId: user._id, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in user" });
  }
};

// Register Customer
const registerCustomer = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, paymentDetails } =
      req.body;
    const profilePicture = req.file ? req.file.path : null;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !paymentDetails
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const hashedPassword = await hashPassword(password);

    const customer = new Customer({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: "customer",
      profilePicture,
      paymentDetails: {
        cardHolderName: paymentDetails.cardHolderName,
        cardNumber: encryptData(paymentDetails.cardNumber),
        expiryDate: encryptData(paymentDetails.expiryDate),
        cvv: encryptData(paymentDetails.cvv),
      },
    });

    await customer.save();
    res
      .status(201)
      .json({ message: "Customer registered successfully", user: customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering customer", error: err.message });
  }
};

// Register Driver
const registerDriver = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, driverDetails } =
      req.body;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !phone ||
      !driverDetails ||
      !driverDetails.licenseNumber ||
      !driverDetails ||
      !driverDetails.vehicleMake ||
      !driverDetails.vehicleModel ||
      !driverDetails.vehicleYear ||
      !driverDetails.vehiclePlate
    ) {
      return res
        .status(400)
        .json({ message: "Missing required fields for driver registring" });
    }

    const hashedPassword = await hashPassword(password);
    const encryptedDriverLicense = encryptFile(req.file.path);

    const driver = new Driver({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: "driver",
      driverDetails: {
        licenseNumber: driverDetails.licenseNumber,
        driverLicense: encryptedDriverLicense,
        vehicleType: "taxi",
        vehicleMake: driverDetails.vehicleMake,
        vehicleModel: driverDetails.vehicleModel,
        vehicleYear: driverDetails.vehicleYear,
        vehiclePlate: driverDetails.vehiclePlate,
      },
    });

    await driver.save();
    res
      .status(201)
      .json({ message: "Driver registered successfully", user: driver });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering driver", error: err.message });
  }
};

//Register Organization
const registerOrganization = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Business license is required." });
    }

    const {
      email,
      password,
      organizationName,
      address,
      taxId,
      contactPerson,
      phone,
    } = req.body;

    const hashedPassword = await hashPassword(password);

    const encryptedBusinessLicensePath = encryptFile(req.file.path);

    const organization = new Organization({
      email,
      password: hashedPassword,
      role: "organization",
      organizationName,
      address,
      taxId,
      contactPerson,
      phone,
      businessLicense: encryptedBusinessLicensePath,
    });

    await organization.save();
    res.status(201).json({
      message: "Organization registered successfully",
      user: organization,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering organization", error: err.message });
  }
};

module.exports = {
  userLogin,
  registerCustomer,
  registerDriver,
  registerOrganization,
};
