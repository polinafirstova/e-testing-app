import {
  Counter,
  Histogram,
  collectDefaultMetrics,
  register,
} from "prom-client";

collectDefaultMetrics({ register });

export const authAttemptsCounter = new Counter({
  name: "app_auth_attempts_total",
  help: "Общее количество попыток авторизации администратора",
  labelNames: ["status"],
});

export const testsCompletedCounter = new Counter({
  name: "app_tests_completed_total",
  help: "Общее количество успешно сданных тестов",
});

export const questionsCreatedCounter = new Counter({
  name: "app_questions_created_total",
  help: "Общее количество созданных вопросов",
});

export const questionsRequestDuration = new Histogram({
  name: "app_questions_request_duration_seconds",
  help: "Длительность обработки запросов к /api/questions в секундах",
  labelNames: ["method", "status"],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export { register };
