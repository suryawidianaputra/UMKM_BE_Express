export const otpGenerator = () => {
  const resource = "1234567890";
  let otp = "";

  for (let i = 0; i < 6; i++) {
    otp += resource[Math.round(Math.random() * resource.length)];
  }

  return otp;
};
