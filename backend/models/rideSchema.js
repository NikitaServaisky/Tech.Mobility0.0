const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    from: {type: String, required: true},
    destination: {type: String, required: true},
    status: {type: String, enum: ["Pending", "Completed", "cancelled"], default: "Pending"},
});

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride