import express from "express";
import {
  getProductById,
  uploadProduct,
  getProductByStore,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { multerImage } from "../middleware/multer.js";

const router = express.Router();
// const cpUpload = upload.array("files");
const cpUpload = multerImage.array("files");

router.get("/products/:product_id", getProductById);
router.get("/stores/:store_id/products", getProductByStore);

router.post("/products", cpUpload, uploadProduct);

router.put("/products/:id", cpUpload, updateProduct);

router.delete("/products/:product_id", deleteProduct);

export default router;
