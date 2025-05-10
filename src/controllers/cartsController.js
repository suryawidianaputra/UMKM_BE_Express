import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const createCart = async (req, res) => {
  try {
    //
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
