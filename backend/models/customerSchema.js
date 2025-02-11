const mongoose = require('mongoose');
const User = require('./userBaseSchema'); // נשתמש ב-User כבסיס

const customerSchema = new mongoose.Schema({
    paymentDetails: {
        cardHolderName: { type: String, required: true },
        cardNumber: { type: String, required: true },
        expiryDate: { type: String, required: true },
        cvv: { type: String, required: true },
    },
});

const Customer = User.discriminator('customer', customerSchema);
module.exports = Customer;
