import { loginAdminRequest } from "../api/auth";

export async function authenticateAdmin(password: string): Promise<void> {
  try {
    const data = await loginAdminRequest(password);
    localStorage.setItem("admin_token", data.token);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неверный пароль";
    console.error("[authService] Ошибка авторизации:", errorMessage);
    throw new Error(errorMessage, { cause: error });
  }
}

export function isAuthenticated(): boolean {
  const expectedToken = import.meta.env.VITE_ADMIN_TOKEN;
  const currentToken = localStorage.getItem("admin_token");

  return currentToken !== null && currentToken === expectedToken;
}

export function logoutAdmin(): void {
  localStorage.removeItem("admin_token");
}
