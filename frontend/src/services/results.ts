import { getResultById, postResults } from "../api/results";
import type { SubmitTestDTO, TestResult } from "../interfaces/UserAnswer";

export const sendTestAnswers = async (
  testData: SubmitTestDTO,
): Promise<{ id: number }> => {
  try {
    const responseData = await postResults(testData);
    return { id: responseData.id };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Неизвестная ошибка при отправке";

    console.error("[resultsService] Ошибка при отправке теста:", errorMessage);
    throw new Error(errorMessage, { cause: error });
  }
};

export const loadTestResult = async (id: number): Promise<TestResult> => {
  try {
    const rawData = await getResultById(id);

    const result: TestResult = rawData;
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Неизвестная ошибка при загрузке результатов";

    console.error(
      `[resultsService] Ошибка при загрузке результата №${id}:`,
      errorMessage,
    );
    throw new Error(errorMessage, { cause: error });
  }
};
