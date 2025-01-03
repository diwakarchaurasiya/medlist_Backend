const mongoose = require('mongoose');
require('dotenv').config();
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error while connecting to database", error);
    }
}

module.exports = connectDB;