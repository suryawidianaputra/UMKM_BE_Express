import bcrypt from "bcrypt";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import { jwtGenerator, jwtEncode } from "../utils/jwt.js";
import { otpGenerator } from "../utils/otpGenerator.js";
import { withoutpassword } from "../utils/userWithoutPassword.js";
import { sendOtp } from "../utils/sendOtp.js";

const prisma = new PrismaClient();

export const getUserByEmail = async (req, res) => {
  try {
    const token = jwtEncode(req.cookies.token);

    const UserData = await prisma.user.findUnique({
      where: {
        email: token.email,
        isDeleted: !true,
      },
    });

    if (UserData === null) {
      return res.status(404).json({ error: "Data not found" });
    }

    return res.status(200).json({
      message: "User found",
      data: withoutpassword(userData),
    });
  } catch (err) {
    return console.log(err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const token = jwtEncode(req.cookie.token);
  } catch (err) {
    return console.log(err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const token = jwtEncode(req.cookies.token);
    const userData = prisma.user.findUnique({
      where: { id: token.id, email: token.email },
    });

    if (!userData) {
      return res.status(404).json({ error: "user not found" });
    }

    const deleteUser = prisma.user.update({
      where: { id: token.id, email: token.email },
      data: { isDeleted: true },
    });

    return res
      .status(200)
      .json({ message: "user deleted", data: withoutpassword(deleteUser) });
  } catch (err) {
    return console.log(err);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updateUserAddress = async (req, res) => {
  try {
    const { phoneNumber, zipCode, address, longitude, latitude } = req.body;
    const token = jwtEncode(req.cookies.token);

    const user = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const userData = await prisma.user.update({
      where: { email: token.email },
      data: { address, phoneNumber, zipCode, longitude, latitude },
    });

    return res.status(200).json({
      message: "User address updated successfully.",
      data: withoutpassword(userData),
    });
  } catch (err) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

export const updatePassword = async (req, res) => {
  try {
    //
  } catch (err) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error." });
  }
};

// auth
export const userRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res
        .status(400)
        .json({ error: "require username, email and password" });

    if (email !== "olenggamer@gmail.com") return false;

    const otpCode = otpGenerator();

    const checkEmail = await prisma.user.findUnique({
      where: { email: email },
    });

    if (checkEmail != null) {
      return res.status(409).json({ error: "Email is already to use" });
    }

    console.log(otpCode);

    req.session.user = { username, email, password };
    req.session.auth = { type: "register", otpCode };

    const response = await sendOtp({ username, email, otpCode });

    if (response.status === 200) {
      return res.status(200).json({ message: "otp send" });
    }
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

    const response = await sendOtp({ username, email, otpCode });
    console.log(otpCode);

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

    if (parseInt(otpCode) != session.auth.otpCode) {
      return res.status(400).json({ msg: "Invalid OTP code" });
    }

    if (session.auth.type === "login") {
      const token = jwtGenerator({
        user_id: req.session.user.id,
        email: req.session.user.email,
        role: req.session.user.role,
      });

      req.session.auth = {};
      req.session.user = {};

      return res.status(200).json({
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
        //
        // user_id: 1,
        // email: "olenggamer@gmail.com",
        // role: "customer",
      });

      req.session.auth = {};
      req.session.user = {};

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

export const reSendOtp = async (req, res) => {
  try {
    const { user, auth } = req.session;

    if (!user || !auth) {
      return res.status(400).json({ error: "No Session Data Found" });
    }

    const otpCode = otpGenerator();
    req.session.auth.otpCode = otpCode;

    // const response = await axios.post(`${process.env.LARAVEL}/api/mail/otp`, {
    //   email: user.email,
    //   username: user.username,
    //   otp_code: otpCode,
    // });

    const response = sendOtp({ username, email, otpCode });

    if (response.status === 500)
      return res.status(500).json({ error: response.data });

    if (response.status === 200)
      return res.status(200).json({ msg: response.data.msg });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
