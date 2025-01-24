const User = require("../models/userBaseSchema");
const Customer = require("../models/customerSchema");
const Driver = require("../models/driverSchema");
const Organization = require("../models/organizationSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Halper to hash password
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_WORD, {
      expiresIn: "24h",
    });

    res
      .status(200)
      .json({ message: "Login successful", token, userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Error logging in user" }); // Fixed typo
  }
};

// Register Customer
const registerCustomer = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, paymentDetails } =
      req.body;

    const hashedPassword = await hashPassword(password);

    const customer = new Customer({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: "customer",
      paymentDetails,
    });

    await customer.save();
    res
      .status(201)
      .json({ messge: "Customer rigistred successfully", user: customer });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering customer", error: err.mesage });
  }
};

// Register Driver
const registerDriver = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, driverDetails } =
      req.body;

    const hashedPassword = await hashPassword(password);

    const driver = new Driver({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      role: "deriver",
      driverDetails,
    });

    await driver.save();
    res
      .status(201)
      .json({ message: "Driver registred successfully", user: driver });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering driver", error: err.message });
  }
};

//Register Organization
const registerOrganization = async (req, res) => {
  try {
    const { email, password, organizationName, address, taxId, contactPerson } =
      req.body;

    const hashedPassword = await hashPassword(password);

    const organization = new Organization({
      email,
      password: hashedPassword,
      role: "organization",
      organizationName,
      address,
      taxId,
      contactPerson,
    });

    await organizationName.save();
    res
      .status(201)
      .json({
        message: "Organization registred successfully",
        user: organization,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registring organization", error: err.message });
  }
};

module.exports = {
  userLogin,
  registerCustomer,
  registerDriver,
  registerOrganization,
};
