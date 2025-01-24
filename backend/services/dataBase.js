const mongoose = require('mongoose');
require('dotenv').config();

const connectBD = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.mnev8.mongodb.net/`,);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB concction error:', err);
        process.exit(1); 
    }
}

module.exports = connectBD;