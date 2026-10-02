import { Request, Response } from "express";
import { query } from "../db";
import { Option } from "../interfaces/Option";
import { Question } from "../interfaces/Question";

export const getQuestions = async (
  req: Request,
  res: Response<Question[] | { error: string }>,
) => {
  try {
    const questionsRes = await query(
      'SELECT id, text, is_hidden AS "isHidden" FROM questions WHERE is_hidden = FALSE ORDER BY id',
    );

    const completeQuestions: Question[] = await Promise.all(
      questionsRes.rows.map(async (dbQuestion) => {
        const optionsRes = await query(
          "SELECT id, text FROM options WHERE question_id = \$1 ORDER BY id",
          [dbQuestion.id],
        );

        const options: Option[] = optionsRes.rows.map((opt) => ({
          id: opt.id,
          text: opt.text,
        }));

        return {
          id: dbQuestion.id,
          text: dbQuestion.text,
          options: options,
          isHidden: dbQuestion.isHidden,
        };
      }),
    );

    res.json(completeQuestions);
  } catch (err: any) {
    console.error(
      "[questions-controller] Ошибка при получении вопросов:",
      err.message,
    );
    res
      .status(500)
      .json({ error: "Внутренняя ошибка сервера при загрузке теста" });
  }
};
