const mongoose = require("mongoose")
const colors = require("colors");
require('dotenv').config();


const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log(`Mongodb connected ${mongoose.connection.host}`.bgGreen.white)
    } catch (error) {
        console.log(`Mongodb server issue ${error}`.bgRed.white)
    }
}

module.exports = connectDB;