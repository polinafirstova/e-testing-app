import { getQuestions } from "../api/questions";
import type { Question } from "../interfaces/Question";

export const loadQuestionsForTest = async (): Promise<Question[]> => {
  try {
    const rawData = await getQuestions();

    const questions: Question[] = rawData;
    return questions;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Неизвестная ошибка сети";

    console.error(
      "[questionsService] Ошибка обработки вопросов:",
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
};
