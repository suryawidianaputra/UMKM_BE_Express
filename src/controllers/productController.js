import { PrismaClient } from "@prisma/client";
import { jwtEncode } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const getProductById = async (req, res) => {
  try {
    const productData = await prisma.product.findUnique({
      where: { id: req.params.product_id },
      include: {
        variants: true,
        comments: true,
        store: true,
      },
    });

    if (!productData) {
      return res.status(404).json({ error: "product not found" });
    }

    return res.status(200).json({ data: productData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const uploadProduct = async (req, res) => {
  try {
    const { variant } = JSON.parse(req.body.variant);
    const { product } = JSON.parse(req.body.product);

    const token = jwtEncode(req.cookies.token);
    const storeData = await prisma.store.findUnique({
      where: { userId: token.user_id },
    });

    const upload = await prisma.product.create({
      data: {
        storeId: storeData.id,
        name: product.name,
        description: product.description,
        discount: product.discount,
      },
    });

    for (let i = 1; i <= variant.length; i++) {
      const v = await prisma.productVariant.create({
        data: {
          productId: upload.id,
          productPrice: variant[i - 1]["productPrice"],
          productStock: variant[i - 1]["productStock"],
          productSoldout: 0,
        },
      });

      const vImg = await prisma.productImage.create({
        data: {
          productId: v.id,
          imageUrl: req.files[i - 1]["filename"],
        },
      });
    }

    const result = await prisma.product.findUnique({
      where: { id: upload.id },
      include: {
        variants: {
          include: {
            images: true,
          },
        },
      },
    });

    return res.status(200).json({ data: result });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const getProductByStore = async (req, res) => {
  try {
    const store = await prisma.store.findUnique({
      where: { id: req.params.store_id },
    });

    const product = await prisma.product.findMany({
      where: {
        store: req.params.store_id,
        isDeleted: !true,
      },
      include: {
        variants: {
          where: {
            isDeleted: !true,
          },
          include: { images: true },
        },
      },
    });

    if (!store) {
      return res.status(404).json({ message: "Product Not Found." });
    }

    if (!product) {
      return res.status(404).json({ message: "Store Does Not Have Products" });
    }

    return res.status(200).json({
      data: product,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error. " });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { isDeleted: !true, id: req.params.product_id },
      data: { isDeleted: true },
      include: {
        variants: true,
      },
    });
    const variant = await prisma.productVariant.update({
      where: { productId: product.id },
      data: { isDeleted: true },
    });
    const img = await prisma.productImage.update({
      where: {
        productId: variant.id,
      },
      data: { isDeleted: true },
    });

    if (!product.isDeleted) {
      return res.status(400).json({ message: "Failed to Delete" });
    }

    return res.status(200).json({ message: "Data Deleted", data: product });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error. " });
  }
};
