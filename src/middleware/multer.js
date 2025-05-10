import multer from "multer";

const product = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/products");
  },
  filename: (req, file, cb) => {
    cb(null, `product${Date.now()}-${file.originalname}`);
  },
});

const userAvatar = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/avatars");
  },
  filename: (req, file, cb) => {
    cb(null, `avatar-${Date.now()}-${file.originalname}`);
  },
});

const comments = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload/comments");
  },
  filename: (req, file, cb) => {
    cb(null, `comment-${Date.now()}-${file.originalname}`);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const multerImage = multer({ storage: product, fileFilter: filter });
export const multerAvatar = multer({ storage: product, fileFilter: filter });
export const multerComment = multer({ storage: product, fileFilter: filter });
