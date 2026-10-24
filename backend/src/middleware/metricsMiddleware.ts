import { NextFunction, Request, Response } from "express";

export function httpDurationMiddleware(histogram: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const end = histogram.startTimer();
    res.on("finish", () => {
      end({
        method: req.method,
        status: res.statusCode.toString(),
      });
    });
    next();
  };
}
