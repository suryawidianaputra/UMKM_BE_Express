import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const sendOtp = async ({ email, username, password }) => {
  const response = await axios.post(`${process.env.LARAVEL}/api/mail/otp`, {
    email: user.email,
    username: user.username,
    otp_code: otpCode,
  });

  return response;
};
