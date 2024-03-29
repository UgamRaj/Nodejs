import generateToken from "../Config/jwtToken.js";
import UserModel from "../Models/userModel.js";
import asyncHandler from "express-async-handler";
import validateMongoDbId from "../utils/validateMongodbId.js";
import generateRefershToken from "../Config/refreshToken.js";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

const userRegistration = asyncHandler(async (req, res) => {
  const email = req.body.email;
  const isUserExist = await UserModel.findOne({ email });
  console.log("🚀 ~ userRegistration ~ isUserExist:", isUserExist);
  if (!isUserExist) {
    //! we are creating new user

    const newUser = await UserModel.create(req.body);
    console.log("🚀 ~ userRegistration ~ newUser:", newUser);
    res.json({
      success: true,
      newUser,
    });
  } else {
    throw new Error("User Already Exists");
  }
});

//! Login User
const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && (await user.isPasswordMatched(password))) {
    const refreshToken = await generateRefershToken(user?._id);
    const updateUser = await UserModel.findByIdAndUpdate(
      user._id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );

    //! Cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: "Login Successfully",
      _id: user?._id,
      firstname: user?.firstname,
      lastname: user?.lastname,
      email: user?.email,
      mobile: user?.mobile,
      token: generateToken(user?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
  //   console.log(process.env.JWT_SECRET_KEY);

  //   const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  //   if (isPasswordCorrect) {
  // //     const payload = {
  // //       id: user._id,
  // //       role: "admin",
  // //     };

  // const token = jwt.sign(payload, process.env.JWT_SECRET_KEY);
  //     return res.json({
  //       success: true,
  //       message: "Logged in successfully",
  //       token,
  //     });
  //   }
  //      else {
  //       throw new Error("Invalid Credentials");
  //     }

  //   res.json({
  //     success: false,
  //     message: "Invalid username or password",
  //   });
});

//! Handle Refresh Token
const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  // console.log("🚀 ~ handleRefreshToken ~ cookie:", cookie);
  if (!cookie?.refreshToken) {
    throw new Error("No Refresh Token in Cookies");
  }

  const refreshToken = cookie.refreshToken;
  // console.log("🚀 ~ handleRefreshToken ~ refreshToken:", refreshToken);
  const user = await UserModel.findOne({ refreshToken });
  if (!user) {
    throw new Error("No Refresh token present in DB or Token not matched");
  }
  jwt.verify(refreshToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    // console.log("🚀 ~ jwt.verify ~ decoded:", decoded.id);
    // console.log("asasas", user._id.toString());
    if (err || user._id.toString() !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({
      success: true,
      accessToken,
    });
  });
});

//! logout functionality
const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie.refreshToken) {
    throw new Error("No refresh token on cookies");
  }
  const refreshToken = cookie.refreshToken;
  const user = await UserModel.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); //! forbidden
  }
  await UserModel.findOneAndUpdate({ refreshToken }, { refreshToken: "" });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  res.sendStatus(204); //! forbidden
});

//! Get All User

const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const getrUsers = await UserModel.find();
    res.json({
      success: true,
      getrUsers,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//! Get Single User

const getSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const getUser = await UserModel.findById({ _id: id });
    res.json({
      success: true,
      getUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//! Delete User
const deleteSingleUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const deleteUser = await UserModel.findByIdAndDelete({ _id: id });
    console.log("🚀 ~ deleteSingleUser ~ deleteUser:", deleteUser);
    res.json({
      success: true,
      deleteUser,
    });
  } catch (error) {
    throw new Error(error);
  }
});

//! Update a User

const updateUser = asyncHandler(async (req, res) => {
  // const { id } = req.params;
  const { _id } = req.user;

  validateMongoDbId(_id);
  try {
    const update = await UserModel.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body.firstname,
        lastname: req?.body.lastname,
        email: req?.body.email,
        mobile: req?.body.mobile,
      },
      { new: true }
    );
    res.json({ success: true, update });
  } catch (error) {
    throw new Error(error);
  }
});

//! Block User

const blockedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);
  try {
    const block = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked: true },
      { new: true }
    );
    res.json({ success: true, message: "User Blocked" });
  } catch (error) {
    throw new Error(error);
  }
});

//! Unblocked User

const unBlockedUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongoDbId(id);

  try {
    const unblock = await UserModel.findByIdAndUpdate(
      id,
      { isBlocked: false },
      { new: true }
    );
    res.json({ success: true, message: "User UnBlocked" });
  } catch (error) {
    throw new Error(error);
  }
});

//! Reset password

const resetPassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  const user = await UserModel.findById(_id);
  // console.log("🚀 ~ resetPassword ~ user:", user);
  const { password } = req.body;
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json({
      success: true,
      updatedPassword,
    });
  } else {
    res.json(user);
  }
});

export {
  userRegistration,
  userLogin,
  resetPassword,
  getAllUsers,
  getSingleUser,
  deleteSingleUser,
  updateUser,
  blockedUser,
  unBlockedUser,
  handleRefreshToken,
  logout,
};
