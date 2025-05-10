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

router.get("/carts/:cart_id", getCartById);
router.get("/users/:user_id/carts", getCartByUserId);

router.patch("/carts/:cart_id", updateCart);

router.delete("/carts/:cart_id", deleteCart);

export default router;
