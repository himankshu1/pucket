import { Router } from "express";
import { uploadImage } from "../controllers/image.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/upload-image")
  .post(verifyJWT, upload.single("image"), uploadImage);

export default router;
