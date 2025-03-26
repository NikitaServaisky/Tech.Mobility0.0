const mongoose = require("mongoose");
const User = require("./userBaseSchema"); // נשתמש ב-User כבסיס

const customerSchema = new mongoose.Schema({
  paymentDetails: {
    cardHolderName: { type: String, required: false },
    cardNumber: { type: String, required: false },
    expiryDate: { type: String, required: false },
    cvv: { type: String, required: false },
  },
  profilePicture: { type: String, default: null },
});

const Customer = User.discriminator("customer", customerSchema);
module.exports = Customer;
