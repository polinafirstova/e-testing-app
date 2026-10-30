import { Router } from "express";
import {
  createQuestion,
  deleteQuestionById,
  getQuestionById,
  getQuestions,
  updateQuestionById,
} from "../controllers/questions";
import { requireAdmin } from "../middleware/authMiddleware";
import { simulateErrors } from "../middleware/errorSimulator";
import { httpDurationMiddleware } from "../middleware/metricsMiddleware";
import { questionsRequestDuration } from "../utils/metrics";

const router = Router();

router.use(httpDurationMiddleware(questionsRequestDuration));

router.get("/", simulateErrors, getQuestions);

router.get("/:id", requireAdmin, getQuestionById);
router.post("/", simulateErrors, requireAdmin, createQuestion);
router.post("/", requireAdmin, createQuestion);
router.put("/:id", requireAdmin, updateQuestionById);
router.delete("/:id", requireAdmin, deleteQuestionById);

export default router;
