import { Request, Response } from "express";
import { query } from "../db";
import { Option } from "../interfaces/Option";
import { AdminQuestion, Question } from "../interfaces/Question";
import { logger } from "../utils/logger";

export async function getQuestions(req: Request, res: Response) {
  try {
    const isAdmin = req.query.admin === "true";

    const sqlQuery = isAdmin
      ? 'SELECT id, text, correct_answer AS "correctAnswerId", is_hidden AS "isHidden" FROM questions ORDER BY id'
      : 'SELECT id, text, is_hidden AS "isHidden" FROM questions WHERE is_hidden = FALSE ORDER BY id';

    const questionsRes = await query(sqlQuery);

    const completeQuestions = await Promise.all(
      questionsRes.rows.map(async (dbQuestion) => {
        const optionsRes = await query(
          "SELECT id, text FROM options WHERE question_id = $1 ORDER BY id",
          [dbQuestion.id],
        );

        const options: Option[] = optionsRes.rows.map((opt) => ({
          id: opt.id,
          text: opt.text,
        }));

        const baseData = {
          id: dbQuestion.id,
          text: dbQuestion.text,
          options: options,
          isHidden: dbQuestion.isHidden,
        };

        if (isAdmin) {
          const adminQuestion: AdminQuestion = {
            ...baseData,
            correctAnswerId: dbQuestion.correctAnswerId,
          };
          return adminQuestion;
        } else {
          const studentQuestion: Question = baseData;
          return studentQuestion;
        }
      }),
    );

    logger.info("Успешное получение списка вопросов", {
      role: isAdmin ? "admin" : "student",
      count: completeQuestions.length,
      context: "getQuestions",
    });

    res.json(completeQuestions);
  } catch (err: any) {
    logger.error("Ошибка при получении вопросов", {
      error: err.message,
      context: "getQuestions",
    });
    res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера при загрузке теста" });
  }
}

export async function deleteQuestionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const deleteRes = await query("DELETE FROM questions WHERE id = $1", [id]);

    if (deleteRes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Вопрос с таким идентификатором не найден" });
    }

    logger.info(`Вопрос с ID ${id} и варианты ответов успешно удалены`, {
      questionId: id,
      context: "deleteQuestionById",
    });

    res.json({
      message: "Вопрос и связанные варианты ответов успешно удалены",
    });
  } catch (err: any) {
    logger.error(`Ошибка при удалении вопроса с ID ${req.params.id}`, {
      error: err.message,
      context: "deleteQuestionById",
    });
    res.status(500).json({ error: "Ошибка сервера при удалении вопроса" });
  }
}

export async function getQuestionById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const questionRes = await query(
      'SELECT id, text, correct_answer AS "correctAnswerId", is_hidden AS "isHidden" FROM questions WHERE id = $1',
      [id],
    );

    if (questionRes.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Вопрос с таким идентификатором не найден" });
    }

    const dbQuestion = questionRes.rows[0];

    const optionsRes = await query(
      "SELECT id, text FROM options WHERE question_id = $1 ORDER BY id",
      [id],
    );

    const options: Option[] = optionsRes.rows.map((opt) => ({
      id: opt.id,
      text: opt.text,
    }));

    const adminQuestion: AdminQuestion = {
      id: dbQuestion.id,
      text: dbQuestion.text,
      options: options,
      correctAnswerId: dbQuestion.correctAnswerId,
      isHidden: dbQuestion.isHidden,
    };

    logger.info(`Успешно загружены данные вопроса с ID ${id}`, {
      questionId: id,
      context: "getQuestionById",
    });

    res.json(adminQuestion);
  } catch (err: any) {
    logger.error(`Ошибка при получении вопроса по ID ${req.params.id}`, {
      error: err.message,
      context: "getQuestionById",
    });
    res
      .status(500)
      .json({ error: "Ошибка сервера при загрузке данных вопроса" });
  }
}

export async function createQuestion(req: Request, res: Response) {
  try {
    const { text, isHidden, options, correctAnswerIndex } = req.body;

    if (!text || !Array.isArray(options) || options.length === 0) {
      return res
        .status(400)
        .json({ error: "Некорректные исходные данные вопроса" });
    }

    const questionInsert = await query(
      "INSERT INTO questions (text, is_hidden) VALUES ($1, $2) RETURNING id",
      [text, isHidden || false],
    );
    const questionId = questionInsert.rows[0].id;

    const insertedOptions = await Promise.all(
      options.map(async (optText: string) => {
        const optInsert = await query(
          "INSERT INTO options (question_id, text) VALUES ($1, $2) RETURNING id, text",
          [questionId, optText],
        );
        return optInsert.rows[0];
      }),
    );

    const correctOptionId = insertedOptions[correctAnswerIndex]?.id;

    if (correctOptionId) {
      await query("UPDATE questions SET correct_answer = $1 WHERE id = $2", [
        correctOptionId,
        questionId,
      ]);
    }

    logger.info(`Новый вопрос успешно создан с ID ${questionId}`, {
      questionId,
      optionsCount: options.length,
      isHidden: isHidden || false,
      context: "createQuestion",
    });

    res.status(201).json({ message: "Вопрос успешно создан", questionId });
  } catch (err: any) {
    logger.error("Ошибка при создании нового вопроса", {
      error: err.message,
      context: "createQuestion",
    });
    res
      .status(500)
      .json({ error: "Ошибка сервера при сохранении нового вопроса" });
  }
}

export async function updateQuestionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { text, isHidden, options, correctAnswerId } = req.body;

    await query(
      "UPDATE questions SET text = $1, is_hidden = $2, correct_answer = $3 WHERE id = $4",
      [text, isHidden, correctAnswerId, id],
    );

    if (Array.isArray(options)) {
      await Promise.all(
        options.map(async (opt: { id: number; text: string }) => {
          await query(
            "UPDATE options SET text = $1 WHERE id = $2 AND question_id = $3",
            [opt.text, opt.id, id],
          );
        }),
      );
    }

    logger.info(`Данные вопроса с ID ${id} успешно обновлены`, {
      questionId: id,
      isHidden,
      context: "updateQuestionById",
    });

    res.json({ message: "Вопрос успешно обновлен" });
  } catch (err: any) {
    logger.error(`Ошибка при обновлении вопроса с ID ${req.params.id}`, {
      error: err.message,
      context: "updateQuestionById",
    });
    res
      .status(500)
      .json({ error: "Ошибка сервера при обновлении данных вопроса" });
  }
}
