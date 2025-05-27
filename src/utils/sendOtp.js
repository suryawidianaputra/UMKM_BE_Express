import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const sendOtp = async ({ email, username, otpCode }) => {
  const response = await axios.post(`${process.env.LARAVEL}/mail/otp`, {
    email: email,
    username: username,
    otp_code: otpCode,
  });

  return response;
};
