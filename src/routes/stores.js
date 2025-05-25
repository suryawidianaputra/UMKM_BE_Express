import express from "express";
import {
  createNewStore,
  getStoreByUserId,
  updateStore,
  getStoreByStoreId,
} from "../controllers/storeController.js";

import { multerAvatar } from "../middleware/multer.js";

const router = express.Router();
const cpUpload = multerAvatar.array("files");

router.get("/stores", getStoreByUserId);
router.get("/stores/:id", cpUpload, getStoreByStoreId);
router.post("/stores", createNewStore);
router.put("/stores", cpUpload, updateStore);

export default router;
