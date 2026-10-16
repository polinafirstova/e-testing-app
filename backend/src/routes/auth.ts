import { Router } from "express";
import { loginAdmin } from "../controllers/auth";

const router = Router();

router.post("/login", loginAdmin);

export default router;
