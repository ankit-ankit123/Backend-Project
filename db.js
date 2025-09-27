const mongoose = require("mongoose");
const url=process.env.MONGODB_URL

const connectDB = async () => {
  try {
    await mongoose.connect(url, {    //url from .env file
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Connection failed:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
