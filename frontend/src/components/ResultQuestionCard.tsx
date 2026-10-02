import type { Question } from "../interfaces/Question";

interface ResultQuestionCardProps {
  question: Question;
  idx: number;
  userAnswerId: number | undefined;
  correctAnswerId: number | undefined;
}

function ResultQuestionCard({
  question,
  idx,
  userAnswerId,
  correctAnswerId,
}: ResultQuestionCardProps) {
  const isCorrect = userAnswerId === correctAnswerId;

  const chosenOption =
    question.options.find((option) => option.id === userAnswerId)?.text ||
    "Нет ответа";

  const correctOption =
    question.options.find((option) => option.id === correctAnswerId)?.text ||
    "Не определен";

  return (
    <div
      className={`flex flex-col gap-3 p-4 border rounded-xl transition-all ${
        isCorrect
          ? "border-emerald-200 bg-emerald-50/30"
          : "border-red-200 bg-red-50/30"
      }`}
    >
      <p className="text-sm font-semibold text-gray-950 leading-snug">
        {idx + 1}. {question.text}
      </p>
      <div className="flex flex-col gap-1 text-xs font-medium">
        <p className={isCorrect ? "text-emerald-700" : "text-red-700"}>
          Ваш ответ: <span className="font-bold">{chosenOption}</span>
        </p>
        {!isCorrect && (
          <p className="text-emerald-700">
            Правильный ответ: <span className="font-bold">{correctOption}</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default ResultQuestionCard;
