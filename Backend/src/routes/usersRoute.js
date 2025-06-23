import express from "express"
import { loginUser, registerUser } from "../controllers/authController.js";
import { getUserProfile, handleUpdateBalance } from "../controllers/usersController.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/", registerUser);
router.get("/users/self", verifyToken, getUserProfile);
router.patch("/users/self/balances", verifyToken, handleUpdateBalance);

export default router;