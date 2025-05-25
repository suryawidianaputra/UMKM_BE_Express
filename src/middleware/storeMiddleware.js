const prisma = new PrismaClient();
import { PrismaClient } from "@prisma/client";
import { jwtEncode } from "../utils/jwt";

export const storeMiddleware = async (req, res, next) => {
  const token = jwtEncode(req.cookies.token);

  if (await prisma.store.findFirst({ where: { userId: token.userId } })) {
    return next();
  }
  return res.json({ error: "" });
};
