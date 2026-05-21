const mongoose = require("mongoose")

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB connected successfully`)
    }
    catch (err) {
        console.error(err)
    }
}


module.exports = connectDB

