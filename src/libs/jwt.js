import jwt from "jsonwebtoken";

export const jwtGenerator = (data) => {
  return jwt.sign(data, process.env.JWT);
};

export const jwtEncode = (data) => {
  return jwt.decode(data, process.env.JWT);
};
