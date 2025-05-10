import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { userLogin, userRegister } from "../controllers/authController.js";

const Route = express.Router();

Route.post("/login", userLogin);
Route.post("/register", userRegister);

export default Route;
