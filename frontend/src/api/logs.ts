import type { SystemLog } from "../interfaces/SystemLog";
import { API_BASE_URL } from "./config";

export async function getSystemLogs(): Promise<SystemLog[]> {
  const response = await fetch(`${API_BASE_URL}/logs`);
  if (!response.ok) {
    throw new Error("Не удалось загрузить системный журнал событий");
  }
  return response.json();
}
