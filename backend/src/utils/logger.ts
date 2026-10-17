import fs from "fs";
import path from "path";

interface JsonLog {
  timestamp: string;
  level: "info" | "error" | "warn";
  message: string;
  "service.name": string;
  context?: string;
  [key: string]: any;
}

const SERVICE_NAME = "backend-api";
const VLOGS_URL = "http://victoria-logs:9428/insert/jsonline";

const LOGS_DIR = path.join(__dirname, "../../../logs");
const LOG_FILE_PATH = path.join(LOGS_DIR, "combined.log");

if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const USER_ACTIONS_CONTEXTS = [
  "submitTest",
  "createQuestion",
  "updateQuestionById",
  "deleteQuestionById",
];

const log = async (
  level: "info" | "error" | "warn",
  message: string,
  extra: Record<string, any> = {},
) => {
  const logEntry: JsonLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    "service.name": SERVICE_NAME,
    ...extra,
  };

  const jsonLine = JSON.stringify(logEntry);

  console.log(jsonLine);

  const isUserAction =
    extra.context && USER_ACTIONS_CONTEXTS.includes(extra.context);

  if (isUserAction) {
    try {
      fs.appendFileSync(LOG_FILE_PATH, jsonLine + "\n", "utf-8");
    } catch (fileErr) {
      console.error("[logger] Ошибка локальной записи в файл:", fileErr);
    }
  }

  try {
    await fetch(VLOGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: jsonLine,
    });
  } catch (err) {}
};

export const logger = {
  info: (message: string, extra = {}) => log("info", message, extra),
  error: (message: string, extra = {}) => log("error", message, extra),
  warn: (message: string, extra = {}) => log("warn", message, extra),
};
