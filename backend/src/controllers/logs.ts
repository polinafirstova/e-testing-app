import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { logger } from "../utils/logger";

const LOG_FILE_PATH = path.join(__dirname, "../../../logs/combined.log");

export const getSystemLogs = async (req: Request, res: Response) => {
  try {
    if (!fs.existsSync(LOG_FILE_PATH)) {
      return res.json([]);
    }

    const fileContent = fs.readFileSync(LOG_FILE_PATH, "utf-8");

    const lines = fileContent.trim().split("\n");

    const parsedLogs = lines
      .filter((line) => line.trim() !== "")
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter((log) => log !== null)
      .reverse();

    res.json(parsedLogs);
  } catch (err: any) {
    logger.error("Ошибка при чтении файла системных логов", {
      error: err.message,
      context: "getSystemLogs",
    });
    res
      .status(500)
      .json({ error: "Не удалось прочитать локальный журнал логирования" });
  }
};
