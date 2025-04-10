const Ride = require("../models/rideSchema");
const Driver = require("../models/driverSchema");

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

const getDriverStats = async (req, res) => {
  const { driverId } = req.params;

  try {
    const driver = await Driver.findById(driverId);

    if (!driver.stats) {
      driver.stats = {
        acceptedRides: 0,
        rejectedRides: 0,
        totalEarnings: 0,
      };
      await driver.save();
    }
    res.status(200).json({
      acceptedRides: driver.stats.acceptedRides,
      rejectedRides: driver.stats.rejectedRides,
      totalEarnings: driver.stats.totalEarnings,
    });
  } catch (err) {
    console.error("Error fetching diriver stats", err);
    res.status(500).json({message: "Server error"});
  }
};

const updateDriverStatsOnAccept = async (driverId) => {
  try {
    const driver = await Driver.findById(driverId);
    if (!driver) {
      console.warn("Driver not found for stat update");
      return;
    }

    if (!driver.stats) {
      driver.stats = {
        acceptedRides: 0,
        rejectedRides: 0,
        totalEarnings: 0,
      };
    }

    driver.stats.acceptedRides += 1;
    driver.stats.totalEarnings += 20; // 💰 רווח קבוע
    await driver.save();
  } catch (err) {
    console.error("Failed to update driver stats", err);
  }
};

module.exports = { getAvailableRides, getDriverStats, updateDriverStatsOnAccept, };
