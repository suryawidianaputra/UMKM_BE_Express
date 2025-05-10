import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  // const token = req.cookies.token;
  // if (!token) {
  //   return res.json({ message: "Access Denied, Token Not Found" }).status(401);
  // }
  // jwt.verify(token, process.env.JWT, (err, decoded) => {
  //   if (err) {
  //     return res.json({ message: "Invalid token" }).status(403);
  //   }
  //   req.user = decoded;
  return next();
  // });
};
