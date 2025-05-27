import express from "express";

import {
  createCart,
  deleteCart,
  getCartById,
  getCartByUserId,
  updateCart,
} from "../controllers/cartsController.js";

const router = express.Router();

router.post("/carts", createCart);

router.get("/carts/:id", getCartById);
router.get("/users/carts", getCartByUserId);

router.put("/carts", updateCart);

router.delete("/carts/:id", deleteCart);

export default router;
