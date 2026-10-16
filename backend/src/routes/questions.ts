import { Router } from "express";
import {
  createQuestion,
  deleteQuestionById,
  getQuestionById,
  getQuestions,
  updateQuestionById,
} from "../controllers/questions";

const router = Router();

router.get("/", getQuestions);
router.get("/:id", getQuestionById);
router.post("/", createQuestion);
router.put("/:id", updateQuestionById);
router.delete("/:id", deleteQuestionById);

export default router;
