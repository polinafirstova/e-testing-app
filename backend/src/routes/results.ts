import { Router } from "express";
import { getTestResultById, submitTest } from "../controllers/results";

const router = Router();

router.post("/", submitTest);
router.get("/:id", getTestResultById);

export default router;
