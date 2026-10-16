import type { AdminQuestion, CreateQuestionData } from "../interfaces/Question";
import { API_BASE_URL } from "./config";

export async function getQuestions(
  isAdmin: boolean = false,
): Promise<AdminQuestion[]> {
  const url = isAdmin
    ? `${API_BASE_URL}/questions?admin=true`
    : `${API_BASE_URL}/questions`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Ошибка сети при запросе вопросов");
  }
  return response.json();
}

export async function deleteQuestionById(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/questions/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Не удалось удалить вопрос с сервера");
  }
}

export async function getQuestionById(id: number): Promise<AdminQuestion> {
  const response = await fetch(`${API_BASE_URL}/questions/${id}?admin=true`);
  if (!response.ok) {
    throw new Error(`Не удалось получить вопрос по идентификатору ${id}`);
  }
  return response.json();
}

export async function editQuestionById(question: AdminQuestion): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/questions/${question.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
  if (!response.ok) {
    throw new Error(
      `Не удалось обновить вопрос с идентификатором ${question.id}`,
    );
  }
}

export async function createQuestion(
  question: CreateQuestionData,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });
  if (!response.ok) {
    throw new Error("Не удалось сохранить новый вопрос на сервере");
  }
}
