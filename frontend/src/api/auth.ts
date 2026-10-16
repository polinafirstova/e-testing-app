import { API_BASE_URL } from "./config";

export async function loginAdminRequest(
  password: string,
): Promise<{ token: string }> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Ошибка авторизации");
  }

  return data;
}
