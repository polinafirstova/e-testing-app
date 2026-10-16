import { Request, Response } from "express";

export async function loginAdmin(req: Request, res: Response) {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ token: process.env.ADMIN_TOKEN });
  }

  return res.status(401).json({ error: "Неверный пароль администратора!" });
}
