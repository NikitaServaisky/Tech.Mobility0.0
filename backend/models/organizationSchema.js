const mongoose = require("mongoose");
const User = require("./userBaseSchema");

const organizationSchema = new mongoose.Schema({
  organizationDetails: {
    organizationName: { type: String, required: true },
    address: { type: String, required: true },
    contactPerson: { type: String, required: true },
    taxId: { type: String, required: true },
    businessLicense: { type: String, required: true }, // File path will be stored
  },
});

const Organization = User.discriminator("organization", organizationSchema);
module.exports = Organization;
