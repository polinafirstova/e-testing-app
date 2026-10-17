import { Router } from "express";
import { getSystemLogs } from "../controllers/logs";

const router = Router();

router.get("/", getSystemLogs);

export default router;
