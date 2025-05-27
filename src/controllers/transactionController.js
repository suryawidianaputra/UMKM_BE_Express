import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "../utils/jwt.js";
import { snap } from "../config/midtrans.js";
const prisma = new PrismaClient();

export const createTransaction = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);
    const { productId, productQuantity, variantId } = req.body;
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { variants: true },
    });
    const user = await prisma.user.findUnique({ where: { id: token.userId } });
    const productVariant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });
    const grossAmount = productVariant.productPrice * productQuantity;
    const resi = `trz-${Date.now()}`;
    const parameter = {
      transaction_details: {
        order_id: resi,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: user.username,
        email: user.email,
        phone: user.phoneNumber,
      },
    };
    const transaction = await snap.createTransaction(parameter);
    const uploadData = await prisma.transaction.create({
      data: {
        productQuantity,
        status: "paid",
        totalAmount: grossAmount,
        userId: token.userId,
        variantId,
        resi,
        productId,
      },
    });
    res.json({
      message: "Transaction created",
      token: transaction.token,
      redirect_url: transaction.redirect_url,
    });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ error: "Internal server error" });
  }
};

export const midtransNotification = async (req, res) => {
  const notificationJson = req.body;

  try {
    const statusResponse = await snap.transaction.notification(
      notificationJson
    );
    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    // Simpan status ke database kamu
    console.log(`Transaction ${orderId} status: ${transactionStatus}`);

    res.status(200).json({ message: "Notification received" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Notification handling error" });
  }
};

export const getTransactionByUserId = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);

    const transaction = await prisma.transaction.findMany({
      where: { userId: token.userId },
      include: {
        product: {
          include: { variants: { include: { images: true } }, store: true },
        },
        user: { include: true },
      },
    });

    if (!transaction) {
      return res.status(404).json({ message: "Not Found" });
    }

    return res.status(200).json({ data: transaction });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ error: "Internal server error" });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { shipingStatus } = req.body;
    const { id } = req.params;

    console.log({ shipingStatus, id });

    const updateTransaction = await prisma.transaction.update({
      where: { id: id },
      data: {
        shipingStatus,
      },
    });

    if (!updateTransaction) {
      return res.status(400).json({ error: "cant update data" });
    }

    return res.status(200).json({ data: updateTransaction });
  } catch (err) {
    console.log(err);
    return res.status(200).json({ error: "Internal server error" });
  }
};
