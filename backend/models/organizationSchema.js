const mongoose = require('mongoose');
const User = require('./userBaseSchema');

const organizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    taxId: {
        type: String,
        required: true,
    },
    contactPerson: {
        name: String,
        email: String,
        phone: String,
    },
});

const Organization = User.discriminator('Organization', organizationSchema);
module.exports = Organization;
