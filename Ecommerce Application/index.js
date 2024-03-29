import express from "express";
import dotenv from "dotenv";
import DbConnect from "./Config/DBConnect.js";
import userAuthRoute from "./Routes/userRoute.js";
import { errorHandler, notFound } from "./Middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import productRoute from "./Routes/productRoute.js";
import morgan from "morgan";

const app = express();
dotenv.config();

const PORT = process.env.PORT || 10000;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

//! Database connection
DbConnect(DATABASE_URL);

app.use("/api/user", userAuthRoute);
app.use("/api/product", productRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server listioning at http://localhost:${PORT}`);
});
