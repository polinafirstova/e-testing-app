import { getSystemLogs } from "../api/logs";
import type { SystemLog } from "../interfaces/SystemLog";

export async function loadSystemLogs(): Promise<SystemLog[]> {
  try {
    return await getSystemLogs();
  } catch (error: unknown) {
    const msg =
      error instanceof Error ? error.message : "Ошибка сети при загрузке логов";
    throw new Error(msg, { cause: error });
  }
}
