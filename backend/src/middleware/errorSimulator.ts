import { NextFunction, Request, Response } from "express";

export function simulateErrors(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (Math.random() < 0.1) {
    return res
      .status(500)
      .json({ error: "Artificial error for demonstration" });
  }
  next();
}
