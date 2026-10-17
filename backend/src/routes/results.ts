import { Router } from "express";
import {
  getStatistics,
  getTestResultById,
  submitTest,
} from "../controllers/results";

const router = Router();

router.post("/", submitTest);
router.get("/statistics", getStatistics);
router.get("/:id", getTestResultById);

export default router;
