const Ride = require("../models/rideSchema");
const { getIO } = require("../services/socket");

// Get rides list by userId
const getRides = async (req, res) => {
  try {
    const { userId } = req.query; // getting userId from request
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
  try {
    const newRide = new Ride({
      from: req.body.from,
      destination: req.body.destination,
      status: "Pending",
    });

    await newRide.save();

    try {
      const io = getIO(); // get socket.io instance
      // Emit a ride update event to all connected clients
      io.emit("rideUpdate", newRide);
    } catch (error) {
      console.error("Socket.io error:", error);
    }

    res.status(201).json(newRide);
  } catch (err) {
    console.error("Error creating ride:", err);
    res.status(500).json({ message: "Error creating ride", err });
  }
};

module.exports = { getRides, getAvailableRides, createRide };
