import express from "express";
import {
  createTransaction,
  midtransNotification,
  getTransactionByUserId,
  updateTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/transactions", createTransaction);
router.post("/midtrans-notification", midtransNotification);
router.get("/transactions", getTransactionByUserId);
router.put("/transactions/:id", updateTransaction);

export default router;
