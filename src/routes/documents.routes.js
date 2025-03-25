import express from "express";
import { protect } from "../middlewares/protect.js";
import {
  createDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  updateDocument,
} from "../controllers/document.controller.js";

const router = express.Router();

router.post("/", protect, createDocument);
router.get("/", protect, getDocuments);
router.get("/:id", protect, getDocument);
router.patch("/:id", protect, updateDocument);
router.delete("/:id", protect, deleteDocument);

export default router;
