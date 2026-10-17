import React from "react";
import { useNavigate } from "react-router";
import type { AdminQuestion } from "../interfaces/Question";
import Button from "./ui/Button";

interface AdminQuestionCardProps {
  question: AdminQuestion;
  idx: number;
  onDeleteClick: (id: number) => void;
}

function AdminQuestionCard({
  question,
  idx,
  onDeleteClick,
}: AdminQuestionCardProps): React.JSX.Element {
  const navigate = useNavigate();

  const correctOptionText =
    question.options.find((option) => option.id === question.correctAnswerId)
      ?.text || "Не определен";

  return (
    <div
      className={`flex flex-col gap-4 p-5 border rounded-xl transition-all ${
        question.isHidden
          ? "border-dashed border-gray-300 bg-gray-100/60 opacity-60"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <p
          className={`text-sm font-semibold leading-snug ${
            question.isHidden ? "text-gray-600 italic" : "text-gray-950"
          }`}
        >
          {idx + 1}. {question.text}
        </p>
        {question.isHidden && (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-300 text-gray-700 rounded-md shrink-0 border border-gray-400/20">
            Скрыт
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2 pl-2 border-l-2 border-gray-200">
        {question.options.map((option, index) => {
          const isCorrect = option.id === question.correctAnswerId;
          let optionStyle = question.isHidden
            ? "text-gray-600"
            : "text-gray-950";
          if (isCorrect) {
            optionStyle = question.isHidden
              ? "text-slate-700 bg-slate-100 border border-slate-200"
              : "text-emerald-700 bg-emerald-50 border border-emerald-100/40";
          }
          return (
            <div
              key={option.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${optionStyle}`}
            >
              <span>
                {index + 1}. {option.text}
              </span>
            </div>
          );
        })}
      </div>
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-t border-gray-200/60 pt-3 text-xs font-medium">
        <p
          className={question.isHidden ? "text-slate-500" : "text-emerald-700"}
        >
          Правильный ответ:{" "}
          <span className="font-bold">{correctOptionText}</span>
        </p>
        <div className="flex gap-2 self-end sm:self-auto">
          <Button
            variant="secondary"
            onClick={() => navigate(`/admin/edit?id=${question.id}`)}
            className="text-xs py-1.5 px-3"
          >
            Редактировать
          </Button>
          <Button
            variant="danger"
            onClick={() => onDeleteClick(question.id)}
            className="text-xs py-1.5 px-3"
          >
            Удалить
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminQuestionCard;
