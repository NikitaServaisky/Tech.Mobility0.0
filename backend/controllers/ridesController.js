const mongoose = require("mongoose");
const Ride = require("../models/rideSchema");
const Driver = require("../models/driverSchema");
const { updateCustomerMetricsOnNewRide } = require("./customerController");
const { updateDriverStatsOnAccept } = require("./driverController");
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

// Create a new ride and notify all drivers
const createRide = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("📥 req.body received at /rides:", req.body);

  if (req.user.role !== "customer") {
    return res.status(403).json({message: "Only customers can create rides"});
  }
  try {
    const newRide = new Ride({
      userId: req.user.userId,
      from: req.body.from,
      destination: req.body.destination,
      pickupCoords: req.body.pickupCoords,
      destinationCoords: req.body.destinationCoords,
      status: "Pending",
    });

    await newRide.save();

    await updateCustomerMetricsOnNewRide({
      userId: req.user.userId,
      from: req.body.from,
      destination: req.body.destination,
    });    

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
  console.log("Accepting ride with:", {rideId, driverId});

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

    //driver stats
    await updateDriverStatsOnAccept(driverId);

    const io = getIO(); // שם נכון של הפונקציה
    io.emit("rideUpdate", updatedRide);

    res.json({ message: "Ride accepted", ride: updatedRide });
  } catch (err) {
    console.error("Error accepting ride", err);
    res.status(500).json({ message: "Server error" });
  }
};

const cancelRide = async (req, res) => {
  const { rideId } = req.params;
  const userId = req.user.userId;

  try {
    const ride = await Ride.findById(rideId);
    if (!ride) return res.status(404).json({ message: "Ride not found" });

    // ✅ כאן התיקון
    if (!ride.userId || ride.userId.toString() !== userId) {
      return res.status(403).json({ message: "You can only cancel your own rides" });
    }

    if (!["Pending", "Accepted"].includes(ride.status)) {
      return res.status(400).json({ message: "Ride cannot be cancelled at this stage" });
    }

    ride.status = "Cancelled";
    await ride.save();

    const io = getIO();
    io.emit("rideUpdate", ride);

    res.status(200).json({ message: "Ride cancelled successfully", ride });
  } catch (err) {
    console.error("Error canceling ride", err);
    res.status(500).json({ message: "Server Error" });
  }
};

const rejectRide = async (req, res) => {
  const { rideId } = req.params;
  const { driverId } = req.body;

  try {
    // בדיקת תקינות מזהים
    if (!mongoose.Types.ObjectId.isValid(rideId) || !mongoose.Types.ObjectId.isValid(driverId)) {
      return res.status(400).json({ message: "Invalid rideId or driverId" });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    if (ride.status !== "Pending") {
      return res.status(400).json({ message: "Ride cannot be rejected" });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // עדכון סטטיסטיקות הנהג
    if (!driver.stats) {
      driver.stats = {
        acceptedRides: 0,
        rejectedRides: 0,
        totalEarnings: 0,
      };
    }

    driver.stats.rejectedRides += 1;
    await driver.save();

    ride.status = "Rejected";
    ride.driverId = null; // אופציונלי: מחזיר את הנסיעה לרשימת "זמינות"
    await ride.save();

    const io = getIO();
    io.emit("rideUpdate", ride); // 💥 עדכון בזמן אמת

    res.status(200).json({ message: "Ride Rejected", ride });
  } catch (err) {
    console.error("❌ Error rejecting ride:", err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  getRides,
  createRide,
  getActiveRides,
  getRideHistory,
  acceptRide,
  cancelRide,
  rejectRide,
};
