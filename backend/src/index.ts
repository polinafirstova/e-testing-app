import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import "./db";
import authRouter from "./routes/auth";
import questionsRouter from "./routes/questions";
import resultsRouter from "./routes/results";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/questions", questionsRouter);
app.use("/api/results", resultsRouter);
app.use("/api/auth", authRouter);

app.get("/api", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Сервер работает!" });
});

app.listen(PORT, () => {
  console.log(`[server]: Сервер запущен на http://localhost:${PORT}`);
});
