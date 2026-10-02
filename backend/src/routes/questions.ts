import { Router } from "express";
import { getQuestions } from "../controllers/questions";

const router = Router();

router.get("/", getQuestions);

export default router;
