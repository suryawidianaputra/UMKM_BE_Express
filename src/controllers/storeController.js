import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "../utils/jwt.js";

const prisma = new PrismaClient();

export const createNewStore = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);
    const userId = token?.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { storeName, storeDescription } = req.body;
    const file = req.files?.[0];

    if (!storeName || !file) {
      return res.status(400).json({
        error: {
          storeName: storeName ? undefined : "required",
          storePicture: file ? undefined : "required",
        },
      });
    }

    const existingStore = await prisma.store.findFirst({
      where: {
        OR: [{ storeName }, { userId }],
      },
    });

    if (existingStore) {
      return res.status(409).json({
        error: "Store already exists for this user or name taken",
      });
    }

    const createStore = await prisma.store.create({
      data: {
        userId,
        storeName,
        storePicture: file.filename,
        storeDescription,
      },
    });

    return res.status(201).json({ data: createStore });
  } catch (err) {
    console.error("Create Store Error:", err);
    return res
      .status(500)
      .json({ error: err.message || "Internal Server Error" });
  }
};
export const getStoreByUserId = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);
    const storeData = await prisma.store.findUnique({
      where: { userId: token.userId },
      include: {
        products: {
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
          },
          where: { isDeleted: false },
        },
      },
    });

    if (!storeData) {
      return res.status(404).json({ message: "Store not found" });
    }

    return res.status(200).json({ data: storeData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const getStoreByStoreId = async (req, res) => {
  try {
    const { id } = req.params;

    const storeData = await prisma.store.findFirst({
      where: { id },
      include: { products: { include: { variants: true } } },
    });
    if (!storeData) {
      return res.status(400).json({ error: "Store not foond" });
    }
    return res.status(200).json({ data: storeData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateStore = async (req, res) => {
  try {
    const token = jwtDecode(req.cookies.token);

    const { storeName, storePicture, storeDescription } = req.body;
    if (!storeName || !storePicture || !storeDescription) {
      return res.status(400).json({
        error: {
          storeName: "required",
          storePicture: "required",
          storeDescription: "required",
        },
      });
    }

    const updateStore = await prisma.store.update({
      where: { userId: token.userId },
      data: { storeName, storePicture, storeDescription },
    });

    if (!updateStore) {
      return res.status(400).json({ error: "can't update data" });
    }

    return res.status(200).json({ data: updateStore });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
