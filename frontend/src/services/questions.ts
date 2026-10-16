import {
  createQuestion,
  deleteQuestionById,
  editQuestionById,
  getQuestionById,
  getQuestions,
} from "../api/questions";
import type { AdminQuestion, CreateQuestionData } from "../interfaces/Question";

export async function loadQuestionsForTest(
  isAdmin: boolean = false,
): Promise<AdminQuestion[]> {
  try {
    const rawData = await getQuestions(isAdmin);
    return rawData;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка сети";

    console.error(
      "[questionsService] Ошибка обработки вопросов:",
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
}

export async function deleteQuestion(id: number): Promise<void> {
  try {
    await deleteQuestionById(id);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Не удалось удалить вопрос";

    console.error(
      `[questionsService] Ошибка при удалении вопроса с идентификатором ${id}:`,
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
}

export async function getQuestion(id: number): Promise<AdminQuestion> {
  try {
    return await getQuestionById(id);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Не удалось получить вопрос с ID ${id}`;
    console.error(
      `[questionsService] Ошибка при получении вопроса с ID ${id}:`,
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
}

export async function addQuestion(question: CreateQuestionData): Promise<void> {
  try {
    await createQuestion(question);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Не удалось создать новый вопрос`;
    console.error(
      `[questionsService] Ошибка при создании нового вопроса:`,
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
}

export async function editQuestion(question: AdminQuestion): Promise<void> {
  try {
    await editQuestionById(question);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : `Не удалось обновить вопрос с ID ${question.id}`;
    console.error(
      `[questionsService] Ошибка при обведении вопроса с ID ${question.id}:`,
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
}
