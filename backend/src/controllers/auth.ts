import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { authAttemptsCounter } from "../utils/metrics";

export async function loginAdmin(req: Request, res: Response) {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    authAttemptsCounter.inc({ status: "success" });

    logger.info("Успешная аутентификация администратора", {
      auth_status: "success",
      context: "loginAdmin",
    });

    return res.json({ token: process.env.ADMIN_TOKEN });
  }

  authAttemptsCounter.inc({ status: "failed" });

  logger.warn(
    "Неудачная попытка входа в панель администратора: неверный пароль",
    {
      auth_status: "failed",
      context: "loginAdmin",
    },
  );

  return res.status(401).json({ error: "Неверный пароль администратора!" });
}
