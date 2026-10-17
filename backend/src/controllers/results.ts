import { Request, Response } from "express";
import { query } from "../db";
import {
  SubmitTestDTO,
  TestResult,
  UserAnswer,
} from "../interfaces/UserAnswer";
import { logger } from "../utils/logger";

export const submitTest = async (
  req: Request<{}, {}, SubmitTestDTO>,
  res: Response<{ id: number } | { error: string }>,
) => {
  const { username, answers } = req.body;

  if (!username || !Array.isArray(answers)) {
    res.status(400).json({
      error: "Неверный формат данных. Требуется username и массив answers",
    });
    return;
  }

  try {
    let score = 0;
    const total = answers.length;

    for (const answer of answers) {
      const questionRes = await query(
        "SELECT correct_answer FROM questions WHERE id = \$1",
        [answer.questionId],
      );

      if (questionRes.rowCount && questionRes.rowCount > 0) {
        const dbCorrectAnswerId = questionRes.rows[0].correct_answer;
        if (answer.optionId === dbCorrectAnswerId) {
          score++;
        }
      }
    }

    await query("BEGIN");

    const resultInsertRes = await query(
      "INSERT INTO test_results (username, score, total) VALUES (\$1, \$2, \$3) RETURNING id",
      [username, score, total],
    );
    const insertedResultId = resultInsertRes.rows[0].id;

    for (const answer of answers) {
      await query(
        "INSERT INTO user_answers (result_id, question_id, selected_option_id) VALUES (\$1, \$2, \$3)",
        [insertedResultId, answer.questionId, answer.optionId],
      );
    }

    await query("COMMIT");

    logger.info(
      `Пользователь "${username}" успешно сдал тест на ${score}/${total}`,
      {
        student: username,
        score: score,
        total: total,
        resultId: insertedResultId,
        context: "submitTest",
      },
    );

    res.status(201).json({
      id: insertedResultId,
    });
  } catch (err: any) {
    await query("ROLLBACK");

    logger.error("Ошибка при отправке и сохранении результатов теста", {
      error: err.message,
      student: username,
      context: "submitTest",
    });

    res
      .status(500)
      .json({ error: "Ошибка сервера при сохранении результатов теста" });
  }
};

export const getTestResultById = async (
  req: Request<{ id: string }>,
  res: Response<TestResult | { error: string }>,
) => {
  const resultId = parseInt(req.params.id, 10);

  if (isNaN(resultId)) {
    res.status(400).json({ error: "Некорректный ID результата" });
    return;
  }

  try {
    const testResultRes = await query(
      'SELECT id, username, score, total, created_at AS "createdAt" FROM test_results WHERE id = \$1',
      [resultId],
    );

    if (testResultRes.rowCount === 0) {
      res
        .status(404)
        .json({ error: "Результат тестирования с таким ID не найден" });
      return;
    }

    const dbResult = testResultRes.rows[0];

    const userAnswersRes = await query(
      `SELECT ua.id, ua.question_id AS "questionId", ua.selected_option_id AS "selectedOptionId", q.correct_answer AS "correctAnswer"
        FROM user_answers ua
        LEFT JOIN questions q ON ua.question_id = q.id
        WHERE ua.result_id = $1 ORDER BY ua.id`,
      [resultId],
    );

    const answers: UserAnswer[] = userAnswersRes.rows.map((row) => ({
      id: row.id,
      questionId: row.questionId,
      selectedOptionId: row.selectedOptionId,
      correctAnswer: row.correctAnswer,
    }));

    const fullTestResult: TestResult = {
      id: dbResult.id,
      username: dbResult.username,
      score: dbResult.score,
      total: dbResult.total,
      createdAt: dbResult.createdAt,
      answers: answers,
    };

    res.json(fullTestResult);
  } catch (err: any) {
    logger.error(`Ошибка при получении результата с ID ${resultId}`, {
      error: err.message,
      resultId: resultId,
      context: "getTestResultById",
    });
    res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера при загрузке результатов" });
  }
};

export async function getStatistics(req: Request, res: Response) {
  try {
    const resultsRes = await query(
      'SELECT id, username, score, total, created_at AS "createdAt" FROM test_results ORDER BY id DESC',
    );

    const metricsRes = await query(`
      SELECT 
        COUNT(*)::int as "totalPasses",
        COALESCE(AVG(score), 0)::float as "averageScore",
        COALESCE(MAX(score), 0)::int as "maxScore"
      FROM test_results
    `);

    const metrics = metricsRes.rows[0];

    const statsData = {
      history: resultsRes.rows,
      summary: {
        totalPasses: metrics.totalPasses,
        averageScore: Math.round(metrics.averageScore * 10) / 10,
        maxScore: metrics.maxScore,
      },
    };

    logger.info(
      "Успешно сформирован и выгружен отчет по статистике тестирования",
      {
        context: "getStatistics",
        totalPasses: statsData.summary.totalPasses,
        averageGroupScore: statsData.summary.averageScore,
      },
    );

    res.json(statsData);
  } catch (err: any) {
    logger.error("Ошибка при формировании статистики ответов", {
      error: err.message,
      context: "getStatistics",
    });

    res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера при формировании аналитики" });
  }
}
