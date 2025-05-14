import express from "express";
import {
  getQuestions,
  addQuestion,
  editQuestion,
  deleteQuestion,
} from "../controllers/questions.controller.js";
import { protect } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.get("/get", protect, getQuestions);
router.post("/add", protect, addQuestion);
router.put("/edit/:id", protect, editQuestion);
router.delete("/delete/:id", protect, deleteQuestion);

export default router;
