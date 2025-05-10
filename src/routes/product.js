import express from "express";
import {
  getProductById,
  uploadProduct,
  getProductByStore,
  deleteProduct,
} from "../controllers/productController.js";
import { multerImage } from "../middleware/multer.js";

const router = express.Router();
const cpUpload = multerImage.any();

router.get("/products/:product_id", getProductById);
router.get("/stores/:store_id/products", getProductByStore);

router.post("/products", cpUpload, uploadProduct);

// router.patch("/products/:product_id");

router.delete("/products/:product_id", deleteProduct);

export default router;
