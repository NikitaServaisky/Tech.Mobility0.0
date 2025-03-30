const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  from: { type: String, required: true },
  destination: { type: String, required: true },
  pickupCoords: {
    lat: Number,
    lon: Number,
  },
  destinationCoords: {
    lat: Number,
    lon: Number,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "InProgress", "Completed", "Cancelled"],
    default: "Pending",
  },
});

rideSchema.pre("save", function (next) {
  const ride = this;

  if (["Accepted", "InProgress"].includes(ride.status) && !ride.driverId) {
    return next(
      new Error("Driver is required when status is Accepted or InProgress")
    );
  }

  next();
});

const Ride = mongoose.model("Ride", rideSchema);

module.exports = Ride;
