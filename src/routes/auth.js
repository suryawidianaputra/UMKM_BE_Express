import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  canCheckout,
  canComment,
  isSeller,
} from "../controllers/authController.js";

const router = express.Router();

router.get("/auth/check/comment", canComment);
router.get("/auth/check/checkout", canCheckout);
router.get("/auth/check/isAdmin", isSeller);

export default router;
