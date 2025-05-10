import bcrypt from "bcrypt";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { jwtGenerator } from "../libs/jwtGenerator.js";
import { otpGenerator } from "../libs/otpGenerator.js";

const prisma = new PrismaClient();

export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const otpCode = otpGenerator();

    if (!username || !email || !password)
      return res
        .status(400)
        .json({ error: "require username, email and password" });

    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (checkEmail != null) {
      return res.status(409).json({ error: "Email is already to use" });
    }

    req.session.user = { username, email, password };
    req.session.auth = { type: "register", otpCode };

    const response = await axios.post(
      `${process.env.LARAVEL}/api/send-otp-mail`,
      {
        email,
        username,
        otp_code: otpCode,
      }
    );

    if (response.status === 500)
      return res.status(500).json({ error: response.data });

    if (response.status === 200)
      return res.status(200).json({ msg: response.data.msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const otpCode = otpGenerator();

    const userData = await prisma.user.findUnique({ where: { email } });

    if (userData == null) {
      return res.status(404).json({ error: "Account not found" });
    }

    if (!(await bcrypt.compare(password, userData.password))) {
      return res.status(400).json({ error: "Password doesn't match" });
    }

    req.session.auth = { type: "login", otpCode: otpCode };
    req.session.user = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    };

    const response = await axios.post(
      `${process.env.LARAVEL}/api/send-otp-mail`,
      {
        email: userData.email,
        username: userData.username,
        otp_code: otpCode,
      }
    );

    if (response.status === 500)
      return res.status(500).json({ error: response.data });

    if (response.status === 200)
      return res.status(200).json({ msg: response.data.msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { otpCode } = req.body;
    const session = req.session;

    if (otpCode !== session.auth.otpCode) {
      return res.status(400).json({ msg: "Invalid OTP code" });
    }

    if (session.auth.type === "login") {
      const token = jwtGenerator({
        user_id: req.session.user.id,
        email: req.session.user.email,
        role: req.session.user.role,
      });

      return res.status(201).json({
        message: "user logged in successfuly",
        token,
      });
    }

    if (session.auth.type === "register") {
      const UploadUserData = await prisma.user.create({
        data: {
          username: session.user.username,
          email: session.user.email,
          password: await bcrypt.hash(session.user.password, 10),
        },
      });

      const token = jwtGenerator({
        user_id: UploadUserData.id,
        email: UploadUserData.email,
        role: UploadUserData.role,
      });

      return res.status(201).json({
        message: "user registered successfuly",
        token,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
