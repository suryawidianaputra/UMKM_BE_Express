import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { canCheckout, canComment } from "../controllers/authController.js";

const router = express.Router();

router.post("/auth/check/comment", canComment);
router.post("/auth/check/checkout", canCheckout);

export default router;
