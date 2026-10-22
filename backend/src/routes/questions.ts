import { Router } from "express";
import {
  createQuestion,
  deleteQuestionById,
  getQuestionById,
  getQuestions,
  updateQuestionById,
} from "../controllers/questions";
import { requireAdmin } from "../middleware/authMiddleware";

const router = Router();

router.get("/", getQuestions);

router.get("/:id", requireAdmin, getQuestionById);
router.post("/", requireAdmin, createQuestion);
router.put("/:id", requireAdmin, updateQuestionById);
router.delete("/:id", requireAdmin, deleteQuestionById);

export default router;
