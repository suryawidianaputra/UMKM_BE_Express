import dotenv from "dotenv";
dotenv.config();

export const sessionConfig = {
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 5, // 5 menit
  },
};
