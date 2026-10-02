import type { Question } from "../interfaces/Question";
import { API_BASE_URL } from "./config";

export const getQuestions = async (): Promise<Question[]> => {
  const response = await fetch(`${API_BASE_URL}/questions`);
  if (!response.ok) {
    throw new Error("Ошибка сети при запросе вопросов");
  }
  return response.json();
};
