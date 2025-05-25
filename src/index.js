import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import multer from "multer";
import { createProxyMiddleware } from "http-proxy-middleware";
import { configDotenv } from "dotenv";
import { sessionConfig } from "./config/session.js";
import { jwtGenerator } from "./utils/jwt.js";

// route
import userRoute from "./routes/users.js";
import productRoute from "./routes/products.js";
import authRoute from "./routes/auth.js";
import storeRoute from "./routes/stores.js";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(session(sessionConfig));
app.use(express.json());
configDotenv();

app.use(userRoute);
app.use(productRoute);
app.use(authRoute);
app.use(storeRoute);

app.use("/images/avatars", express.static("upload/avatars"));
app.use("/images/comments", express.static("upload/comments"));
app.use("/images/products", express.static("upload/products"));

app.listen(process.env.PORT, () =>
  console.log(`Express server runnning on ${process.env.PORT}`)
);

// dev
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

app.get("/jwt", (req, res) => {
  return res.json({
    token: jwtGenerator({
      userId: "589d7ab6-4095-4008-9503-3fb2226a74a3",
      email: "olenggamer@gmail.com",
      role: "customer",
    }),
  });
});

app.get("/store", async (req, res) => {
  const a = await prisma.store.create({
    data: {
      userId: "589d7ab6-4095-4008-9503-3fb2226a74a3",
      storeName: "Batik Kita",
      latitude: -6.175392,
      longitude: 106.827153,
      isActive: true,
      storePicture: "dummy coy",
    },
  });
  res.json({ a });
});
