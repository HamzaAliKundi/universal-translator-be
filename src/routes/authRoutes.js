import { Router } from "express";
import {
  checkUsername,
  getUser,
  login,
  signup,
  verifyEmail,
  checkHasPaid,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/protect.js";
const router = Router();
router.post("/signup", signup); // Async controller function
router.post("/login", login); // Async controller function
router.get("/check-username", checkUsername); // Async controller function
router.get("/verify/:token", verifyEmail); // Async controller function
router.get("/get-user", getUser); // Async controller function
router.get("/has-paid", protect, checkHasPaid); // Async controller function

export default router;
