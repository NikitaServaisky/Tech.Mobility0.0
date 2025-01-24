const mongoose = require('mongoose');
const User = require('./userBaseSchema');

const customerSchema = new mongoose.Schema({
    paymentDetails: {
        creditCardNumber: {
            type: String,
        },
        expirationDate: {
            type: String,
        },
        cvv: {
            type: String,
        },
    },
});

const Customer = User.discriminator('Customer', customerSchema);
module.exports = Customer;
