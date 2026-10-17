export interface SystemLog {
  timestamp: string;
  level: "info" | "error" | "warn";
  message: string;
  "service.name": string;
  context?: string;
  student?: string;
  score?: number;
  total?: number;
  questionId?: number | string;
  error?: string;
}
