import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  deleteUser,
  getUserByEmail,
  updateUser,
  userLogin,
  userRegister,
  verifyOTP,
  updateUserAddress,
} from "../controllers/usersController.js";
const Route = express.Router();

Route.get("/users", getUserByEmail);

Route.post("/users/register", userRegister);
Route.post("/users/login", userLogin);
Route.post("/auth/verify-otp", verifyOTP);

Route.patch("/users", updateUser);
Route.patch("/users/address", updateUserAddress);
// Route.patch("/users/:reset_token/password");
// Route.patch("/users/:reset_token/email");

Route.delete("/users", deleteUser);

export default Route;
