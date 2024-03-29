import mongoose from "mongoose";

const DbConnect = async (DATABASE_URL) => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("🚀 ~ DbConnect ~ error:", error);
  }
};

export default DbConnect;
