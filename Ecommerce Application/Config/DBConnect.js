import mongoose from "mongoose";

const DbConnect = async (DATABASE_URL) => {
  try {
    const DB_OPTIONS = {
      // dbName: "todo",
      dbName: process.env.DB_NAME, //Check .env file
    };
    await mongoose.connect(DATABASE_URL, DB_OPTIONS);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("🚀 ~ DbConnect ~ error:", error);
  }
};

export default DbConnect;
