import bcrypt from "bcrypt";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
// import { jwtGenerator } from "../libs/jwtGenerator.";
import { jwtDecode } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const canCheckout = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);
    const userData = await prisma.user.findFirst({
      where: {
        id: userData.userId,
        phoneNumber: !null,
        zipCode: !null,
        longitude: !null,
        latitude: !null,
      },
    });

    if (!userData) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const canComment = async (req, res) => {
  try {
    const { product_id } = req.body;
    const token = jwtDecode(req.cookies.token);

    if (!product_id)
      return res.status(400).json({ error: "require product_id" });

    const response = await axios.post(
      `${process.env.LARAVEL}/auth/check/comment`,
      {
        userId: token.userId,
        productId: product_id,
      }
    );

    if (response.data.status !== 200) {
      return res.status(401).json({ error: "unauthorized" });
    }
    return res.status(200).json({ status: "ok" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
