import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "../utils/jwt.js";
const prisma = new PrismaClient();

export const createCart = async (req, res) => {
  try {
    const { productId, quantity } = req.bdoy;
    const token = jwtDecode(req.cookies.token);

    return res.json({
      data: await prisma.cart.upsert({
        where: { userId_productId: { userId, productId } },
        update: { quantity: { increment: quantity } },
        create: {
          userId,
          productId,
          quantity: quantity,
        },
      }),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCartById = async (req, res) => {
  try {
    //
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getCartByUserId = async (req, res) => {
  try {
    //
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    //
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    //
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
