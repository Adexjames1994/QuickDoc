import express from "express";
import multer from "multer";
import { uploadDocument, verifyDocument } from "../controllers/documentController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/verify/:hash", verifyDocument);

export default router;
