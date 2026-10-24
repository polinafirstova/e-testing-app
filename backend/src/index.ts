import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import "./db";
import authRouter from "./routes/auth";
import logsRouter from "./routes/logs";
import questionsRouter from "./routes/questions";
import resultsRouter from "./routes/results";
import { logger } from "./utils/logger";
import { register } from "./utils/metrics";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/metrics", async (req: Request, res: Response) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

app.use("/api/questions", questionsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/auth", authRouter);
app.use("/api/logs", logsRouter);

app.get("/api", (req: Request, res: Response) => {
  logger.info("Проверка работы сервера");
  res.json({ status: "OK", message: "Сервер работает!" });
});

app.listen(PORT, () => {
  logger.info(`Сервер запущен на порту ${PORT}`, {
    url: `http://localhost:${PORT}`,
  });
});
