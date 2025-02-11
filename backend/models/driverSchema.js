const mongoose = require('mongoose');
const User = require('./userBaseSchema');

const driverSchema = new mongoose.Schema({
    driverDetails: {
        licenseNumber: { type: String, required: true },
        vehicleType: { type: String, required: true },
        vehicleMake: {type: String, required: true},
        vehicleModel: {type: String, required: true},
        vehicleYear: {type: Number, required: true},
        vehiclePlate: {type: Number, required: true},
    },
});

const Driver = User.discriminator('driver', driverSchema);
module.exports = Driver;
