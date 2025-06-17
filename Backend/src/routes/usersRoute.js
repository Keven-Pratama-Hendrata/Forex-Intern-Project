import express from "express"
import { loginUser } from "../controllers/authController.js";
import { getUserProfile, handleUpdateBalance } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfile);
router.post("/update-balance", verifyToken, handleUpdateBalance);

export default router;