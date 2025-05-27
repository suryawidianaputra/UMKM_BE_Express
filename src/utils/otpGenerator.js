export const otpGenerator = () => {
  const resource = "12345678900";
  let otp = "0";

  for (let i = 0; i < 6; i++) {
    otp += resource[Math.floor(Math.random() * resource.length)];
  }

  return parseInt(otp);
};
