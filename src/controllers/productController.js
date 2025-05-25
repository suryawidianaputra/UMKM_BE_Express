import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const getProductById = async (req, res) => {
  try {
    const productData = await prisma.product.findUnique({
      where: { id: req.params.product_id, isDeleted: false },
      include: {
        variants: {
          include: {
            images: {
              include: true,
              where: { isDeleted: false },
            },
          },
          where: { isDeleted: false },
        },
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

    if (!req.files || req.files.length !== variant.length) {
      return res
        .status(400)
        .json({ message: "Jumlah gambar dan variant tidak cocok." });
    }

    const token = jwtDecode(req.cookies.token);
    const storeData = await prisma.store.findUnique({
      where: { userId: token.userId },
    });

    const createdProduct = await prisma.product.create({
      data: {
        storeId: storeData.id,
        name: product.name,
        description: product.description,
        discount: product.discount,
      },
    });

    for (let i = 0; i < variant.length; i++) {
      const v = await prisma.productVariant.create({
        data: {
          productId: createdProduct.id,
          productPrice: variant[i].productPrice,
          productStock: variant[i].productStock,
          productVariantName: variant[i].productVariantName,
          productSoldout: 0,
        },
      });

      await prisma.productImage.create({
        data: {
          variantId: v.id,
          imageUrl: req.files[i]?.filename,
        },
      });
    }

    const result = await prisma.product.findFirst({
      where: { id: createdProduct.id },
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
    console.error("Upload Product Error:", err);
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

export const updateProduct = async (req, res) => {
  try {
    const { variant } = JSON.parse(req.body.variant);
    const product = JSON.parse(req.body.product);

    const files = req.files; // array dari multer

    // Update product utama
    await prisma.product.update({
      where: { id: product.id },
      data: {
        name: product.name,
        description: product.description,
        discount: product.discount,
      },
    });

    // Update tiap variant
    // console.log(variant);
    // return;
    for (let i = 0; i < variant.length; i++) {
      const v = variant[i];
      const file = files[i];

      // Update variant info
      await prisma.productVariant.update({
        where: { id: v.id },
        data: {
          productVariantName: v.productVariantName,
          productPrice: v.productPrice,
          productStock: v.productStock,
        },
      });

      if (file) {
        // Hapus gambar lama (soft delete)
        await prisma.productImage.updateMany({
          where: { variantId: v.id, isDeleted: false },
          data: { isDeleted: true },
        });

        // Simpan gambar baru
        await prisma.productImage.create({
          data: {
            variantId: v.id,
            imageUrl: file.filename, // filename dari multer
          },
        });
      }
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Update failed", error });
  }
};
