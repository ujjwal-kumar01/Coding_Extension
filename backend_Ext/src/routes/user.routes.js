import express from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";

const router = express.Router();

// Register a new user
router.post("/register", registerUser);

// Login an existing user
router.post("/login", loginUser);

// Logout user (on client, remove token)
router.post("/logout", logoutUser);

export default router;
