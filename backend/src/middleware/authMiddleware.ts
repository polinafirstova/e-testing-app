import { NextFunction, Request, Response } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Требуется авторизация" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Неверный токен доступа" });
  }

  next();
}
