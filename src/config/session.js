import { configDotenv } from "dotenv";
configDotenv();

export const sessionConfig = {
  secret: process.env.KEY,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    // maxAge: 1000 * 60 * 60 * 24, // 5 menit
    maxAge: 1000 * 60 * 5, // 5 menit
  },
};
