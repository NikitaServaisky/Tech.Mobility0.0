const User = require("../models/userBaseSchema");

const howIsUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let dashboardData = {};
    switch (user.role) {
      case "driver":
        dashboardData = { message: "the user is a driver", data };
        break;
      case "customer":
        dashboardData = { message: "the user is a simple customer", data };
        break;
      default:
        dashboardData = { message: "the user is a oraganization", data };
    }
    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

module.exports = { howIsUser };
