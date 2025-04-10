const Customer = require("../models/customerSchema"); // ודא שיש את המודל

const updateCustomerMetricsOnNewRide = async ({ userId, from, destination }) => {
  try {
    const customer = await Customer.findById(userId);
    if (!customer) {
      console.warn("Customer not found");
      return;
    }

    if (!customer.customerMetrics) {
      customer.customerMetrics = {
        totalRides: 0,
        totalSpent: 0,
        visitedAddresses: [],
      };
    }

    customer.customerMetrics.totalRides += 1;
    customer.customerMetrics.totalSpent += 20; // 💰 אפשר לעדכן בעתיד לפי מרחק
    customer.customerMetrics.visitedAddresses.push(from, destination);

    await customer.save();
  } catch (err) {
    console.error("Error updating customer metrics", err);
  }
};

module.exports = {
  updateCustomerMetricsOnNewRide,
};
