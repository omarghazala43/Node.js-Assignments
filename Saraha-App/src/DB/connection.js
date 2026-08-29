import mongoose from "mongoose";

const url = "mongodb://localhost:27017/Saraha-App";

async function DBconnection() {
  try {
    await mongoose.connect(url);
    console.log("DB connected successfully");
  } catch (error) {
    console.log({ message: error.message });
  }
}

export default DBconnection;
