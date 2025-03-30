const mongoose = require("mongoose");
const Ride = require("../models/rideSchema");
const { getIO } = require("../services/socket");

// Get rides list by userId
const getRides = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }
    const rides = await Ride.find({ userId }); // get rides for that user
    res.json(rides);
  } catch (err) {
    console.error("Error fetching rides", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get available rides (for drivers)
const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "pending" }); // search rides
    res.json(rides);
  } catch (err) {
    console.error("Error fetching available rides", err);
    res.status(500).json({ message: "Error fetching rides", err });
  }
};

// Create a new ride and notify all drivers
const createRide = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("📥 req.body received at /rides:", req.body);
  try {
    const newRide = new Ride({
      userId: req.body.userId,
      from: req.body.from,
      destination: req.body.destination,
      pickupCoords: req.body.pickupCoords,
      destinationCoords: req.body.destinationCoords,
      status: "Pending",
    });

    await newRide.save();

    const io = getIO(); // get socket.io instance
    // Emit a ride update event to all connected clients
    io.emit("rideUpdate", newRide);

    res.status(201).json(newRide);
  } catch (err) {
    console.error("Error creating ride:", err);
    res.status(500).json({ message: "Error creating ride", err });
  }
};

const getActiveRides = async (req, res) => {
  const { userId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const activeStatuses = ["Pending", "accepted", "InProgress"];
  const rides = await Ride.find({ userId, status: { $in: activeStatuses } });
  res.json(rides);
};

const getRideHistory = async (req, res) => {
  const { userId } = req.query;
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  const rides = await Ride.find({
    userId,
    status: { $in: ["Complete", "cancel"] },
  });
  res.json(rides);
};

const acceptRide = async (req, res) => {
  const { rideId } = req.params;
  const { driverId } = req.body;

  try {
    if (
      !mongoose.Types.ObjectId.isValid(rideId) ||
      !mongoose.Types.ObjectId.isValid(driverId)
    ) {
      return res.status(400).json({ message: "Invalid rideId or driverId" });
    }

    const updatedRide = await Ride.findOneAndUpdate(
      { _id: rideId, status: "Pending" },
      { status: "Accepted", driverId },
      { new: true }
    );

    if (!updatedRide) {
      return res
        .status(404)
        .json({ message: "Ride not found or already taken" });
    }

    const io = getIO(); // שם נכון של הפונקציה
    io.emit("rideUpdate", updatedRide);

    res.json({ message: "Ride accepted", ride: updatedRide });
  } catch (err) {
    console.error("Error accepting ride", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getRides,
  getAvailableRides,
  createRide,
  getActiveRides,
  getRideHistory,
  acceptRide,
};
