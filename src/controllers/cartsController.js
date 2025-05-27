import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "../utils/jwt.js";
const prisma = new PrismaClient();

export const createCart = async (req, res) => {
  try {
    const { productId, variantSelected, productQuantity } = req.body;
    const token = jwtDecode(req.cookies.token);

    const existingCart = await prisma.cart.findUnique({
      where: {
        productId_userId: {
          productId,
          userId: token.userId,
        },
      },
    });

    if (existingCart) {
      return res.status(200).json({
        data: await prisma.cart.update({
          where: {
            productId_userId: {
              userId: existingCart.userId,
              productId: productId,
            },
          },
          data: {
            quantity: existingCart.quantity + parseInt(productQuantity),
          },
        }),
      });
    } else {
      return res.status(201).json({
        dataa: await prisma.cart.create({
          data: {
            quantity: parseInt(productQuantity),
            productId,
            variantId: variantSelected,
            userId: token.userId,
          },
        }),
      });
    }
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
    const token = jwtDecode(req.cookies.token);

    console.log(token);
    const cartData = await prisma.cart.findMany({
      where: {
        userId: token.userId,
      },
      include: {
        product: {
          include: {
            variants: {
              where: { isDeleted: false }, // filter hanya variant yang tidak dihapus
              include: {
                images: {
                  where: { isDeleted: false }, // filter hanya gambar yang tidak dihapus
                },
              },
            },
            store: true,
          },
        },
      },
    });

    console.log({ data: cartData });

    // const variant = await prisma.productVariant({where: {id: }})

    return res.status(200).json({ data: cartData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { productId, variantSelected, productQuantity } = req.body;
    const token = jwtDecode(req.cookies.token);

    return res.status(200).json({
      data: await prisma.cart.update({
        where: {
          productId_userId: {
            userId: token.userId,
            productId: productId,
          },
        },
        data: {
          quantity: productQuantity,
        },
      }),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteCart = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);

    const deleteCart = await prisma.cart.delete({
      where: { id: req.params.id },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
