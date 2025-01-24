const mongoose = require('mongoose');
const User = require('./userBaseSchema');

const driverSchema = new mongoose.Schema({
    driverDetails: {
        vehicle: {
            licensePlate: {
                type: String,
            },
            insurancePolicy: {
                type: String,
            },
            insuranceExpiry: {
                type: Date,
            },
        },
        driverLicense: {
            type: String,
        },
        medicalApproval: {
            type: String,
        },
        bankDetails: {
            accountNumber: {
                type: String,
            },
            bankName: {
                type: String,
            },
            branchCode: {
                type: String,
            },
        },
    },
});

const Driver = User.discriminator('Driver', driverSchema);
module.exports = Driver;
