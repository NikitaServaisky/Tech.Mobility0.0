const mongoose = require('mongoose');
const User = require('./userBaseSchema');

const driverSchema = new mongoose.Schema({
    driverDetails: {
        licenseNumber: { type: String, required: true },
        vehicleMake: { type: String, required: true },
        vehicleModel: { type: String, required: true },
        vehicleColor: { type: String, required: true },
        vehicleYear: { type: Number, required: true },
        vehiclePlate: { type: String, required: true },
        bankDetails: {
          bankName: { type: String, required: true },
          branchNumber: { type: String, required: true },
          accountOwner: { type: String, required: true },
        },
    },
    driverLicense: { type: String, required: true },
    vehiclePhoto: { type: String, required: false },
    stats: {
      acceptedRides: {type: Number, default: 0},
      rejectedRides: {type: Number, default: 0},
      totalEarnings: {type: Number, default: 0},
    }
});

const Driver = User.discriminator('driver', driverSchema);
module.exports = Driver;
