import type { SubmitTestDTO, TestResult } from "../interfaces/UserAnswer";
import { API_BASE_URL } from "./config";

export async function postResults(
  bodyData: SubmitTestDTO,
): Promise<{ id: number }> {
  const response = await fetch(`${API_BASE_URL}/results`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bodyData),
  });
  if (!response.ok) {
    throw new Error("Ошибка сети при отправке результатов");
  }
  return response.json();
}

export async function getResultById(id: number): Promise<TestResult> {
  const response = await fetch(`${API_BASE_URL}/results/${id}`);
  if (!response.ok) {
    throw new Error(`Ошибка сети при получении результата №${id}`);
  }
  return response.json();
}

export async function getStatistics() {
  const response = await fetch(`${API_BASE_URL}/results/statistics`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить данные статистики");
  }
  return response.json();
}
