import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import { createProxyMiddleware } from "http-proxy-middleware";
import { configDotenv } from "dotenv";
import { sessionConfig } from "./config/session.js";

// route
import userRoute from "./routes/users.js";
import productRoute from "./routes/product.js";
import multer from "multer";

const app = express();
app.use(cookieParser());
app.use(cors());
app.use(session(sessionConfig));
app.use(express.json());
configDotenv();

app.use(userRoute);
app.use(productRoute);

app.use("/image/avatars", express.static("upload/avatars"));
app.use("/image/comments", express.static("upload/comments"));
app.use("/image/products", express.static("upload/products"));

app.listen(process.env.PORT, () =>
  console.log(`server runnning on ${process.env.PORT}`)
);
