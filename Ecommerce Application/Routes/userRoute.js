import express from "express";
import {
  blockedUser,
  deleteSingleUser,
  getAllUsers,
  getSingleUser,
  handleRefreshToken,
  logout,
  resetPassword,
  unBlockedUser,
  updateUser,
  userLogin,
  userRegistration,
} from "../Controllers/userController.js";
import { authMiddleware, isAdmin } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", userRegistration);
router.post("/login", userLogin);
router.patch("/resetpassword", authMiddleware, resetPassword);
router.get("/allusers", getAllUsers);
// router.get("/refresh", authMiddleware, isAdmin, handleRefreshToken);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);
router.get("/:id", authMiddleware, isAdmin, getSingleUser);
router.delete("/:id", deleteSingleUser);
router.put("/edituser", authMiddleware, updateUser);
router.put("/blockuser/:id", authMiddleware, isAdmin, blockedUser);
router.put("/unblockuser/:id", authMiddleware, isAdmin, unBlockedUser);

export default router;
