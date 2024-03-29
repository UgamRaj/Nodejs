import UserModel from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

const authMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  if (req?.headers?.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        // console.log("🚀 ~ authMiddleware ~ decoded:", decoded);
        const user = await UserModel.findById({ _id: decoded?.id });
        // console.log("🚀 ~ authMiddleware ~ user:", user);
        req.user = user;
        next();
      }
    } catch (error) {
      throw new Error("Not Authorized token expired, Please Login Again");
    }
  } else {
    throw new Error("There is no token atteched to header");
  }
});

const isAdmin = asyncHandler(async (req, res, next) => {
  console.log("isAdmin", req.user);
  const { email } = req.user;
  const admin = await UserModel.findOne({ email });
  // console.log("🚀 ~ isAdmin ~ admin:", admin);
  if (admin.role !== "admin") {
    throw new Error("You are not an admin");
  } else {
    next();
  }
});

export { authMiddleware, isAdmin };
