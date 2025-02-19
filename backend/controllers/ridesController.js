const Ride = require("../models/rideSchema");
const {getIo} = require('../services/socket');

// getting rides list by userId
const getRides = async (req, res) => {
  try {
    const { userId } = req.query; // getting userId form request
    if (!userId) {
      return res.status(400).json({ message: "Missing userId parameter" });
    }

    const rides = await Ride.find({ userId }); // getting rides for that user
    res.json(rides);
  } catch (err) {
    console.error("Error fetching rides", err);
    res.status(500).json({ message: "Server error" });
  }
};

// aletr driver to ride
const getAvailableRides = async (req, res) => {
  try {
    const rides = await Ride.find({ status: "pending" }); // search rides
    res.json(rides);
  } catch (err) {
    console.error("Error fatching avaible rides", err);
    res.status(500).json({ message: "שגיאה בשליפת נסיעות", err });
  }
};

// create new ride and send to all drivers
const createRide = async (req, res) => {
  try {
    const newRide = new Ride({
      from: req.body.from,
      destination: req.body.destination,
      status: "Pending",
    });

    await newRide.save();

    try {
      const io = getIO(); // קבלת מופע ה-io
      io.emit("new-ride", newRide); // שליחה לכל הנהגים
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
