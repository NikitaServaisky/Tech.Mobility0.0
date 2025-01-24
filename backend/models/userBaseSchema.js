const mongoose = require('mongoose');

const userBaseSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['customer', 'driver', 'organization'],
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profilePicture: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { discriminatorKey: 'role' }); // Add a discriminator key.

const User = mongoose.model('User', userBaseSchema);
module.exports = User;
