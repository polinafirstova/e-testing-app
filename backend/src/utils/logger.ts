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

const log = async (
  level: "info" | "error" | "warn",
  message: string,
  extra = {},
) => {
  const logEntry: JsonLog = {
    timestamp: new Date().toISOString(),
    level,
    message,
    "service.name": SERVICE_NAME,
    ...extra,
  };

  console.log(JSON.stringify(logEntry));

  try {
    await fetch(VLOGS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(logEntry),
    });
  } catch (err) {}
};

export const logger = {
  info: (message: string, extra = {}) => log("info", message, extra),
  error: (message: string, extra = {}) => log("error", message, extra),
  warn: (message: string, extra = {}) => log("warn", message, extra),
};
