import React, { useState } from "react";
import type {
  AdminQuestion,
  CreateQuestionData,
  EditQuestionData,
} from "../interfaces/Question";
import {
  validateOptions,
  validateQuestionText,
} from "../utils/validateQuestion";
import InputField from "./ui/InputField";

interface QuestionFormProps {
  initialData?: AdminQuestion | null;
  onSubmit: (data: CreateQuestionData | EditQuestionData) => Promise<void>;
  onCancel: () => void;
  onDelete?: () => void;
}

export default function QuestionForm({
  initialData,
  onSubmit,
  onCancel,
  onDelete,
}: QuestionFormProps) {
  const [text, setText] = useState<string>(initialData?.text || "");
  const [isHidden, setIsHidden] = useState<boolean>(
    initialData?.isHidden || false,
  );

  const [options, setOptions] = useState<string[]>(
    initialData ? initialData.options.map((o) => o.text) : ["", ""],
  );

  const [correctAnswerIndex, setCorrectAnswerIndex] = useState<number>(
    initialData
      ? initialData.options.findIndex(
          (o) => o.id === initialData.correctAnswerId,
        )
      : 0,
  );

  const [validationError, setValidationError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      setValidationError(
        "Вопрос должен содержать как минимум два варианта ответа!",
      );
      return;
    }
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);

    if (correctAnswerIndex >= updated.length) {
      setCorrectAnswerIndex(updated.length - 1);
    }
  };

  const handleFormSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setValidationError("");

    const textError = validateQuestionText(text);

    if (textError) {
      setValidationError(textError);
      return;
    }

    const optionsError = validateOptions(options);
    if (optionsError) {
      setValidationError(optionsError);
      return;
    }

    setIsSubmitting(false);

    try {
      if (initialData) {
        const updatedOptions = options.map((optText, idx) => ({
          id: initialData.options[idx]?.id || Date.now() + idx,
          text: optText.trim(),
        }));

        await onSubmit({
          id: initialData.id,
          text: text.trim(),
          isHidden,
          options: updatedOptions,
          correctAnswerId: updatedOptions[correctAnswerIndex]?.id || 0,
        });
      } else {
        await onSubmit({
          text: text.trim(),
          isHidden,
          options: options.map((o) => o.trim()),
          correctAnswerIndex,
        });
      }
    } catch (error: unknown) {
      const displayMessage =
        error instanceof Error ? error.message : "Ошибка сохранения";
      setValidationError(displayMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="flex flex-col gap-6 w-full">
      {validationError && (
        <p className="text-sm font-medium text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
          {validationError}
        </p>
      )}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="question-text"
          className="text-sm font-semibold text-gray-700"
        >
          Текст вопроса:
        </label>
        <textarea
          id="question-text"
          rows={3}
          placeholder="Введите формулировку вопроса"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all text-sm text-gray-900 placeholder-gray-400"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold text-gray-700">
            Варианты ответов:
          </label>
          <button
            type="button"
            onClick={handleAddOption}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 px-2.5 py-1 bg-blue-50 hover:bg-blue-100/60 rounded-lg transition-colors cursor-pointer"
          >
            + Добавить вариант
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {options.map((option, idx) => (
            <div key={idx} className="flex items-center gap-3 w-full">
              <input
                type="radio"
                name="correct-answer-selection"
                checked={correctAnswerIndex === idx}
                onChange={() => setCorrectAnswerIndex(idx)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer shrink-0"
              />
              <div className="flex-1">
                <InputField
                  id={`option-${idx}`}
                  label={`Вариант ${idx + 1}`}
                  placeholder="Текст ответа"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                />
              </div>
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => handleRemoveOption(idx)}
                  className="p-2 border border-red-200 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-xs font-bold shrink-0 mt-7"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200/60 rounded-xl cursor-pointer hover:bg-gray-100/50 transition-colors">
        <input
          type="checkbox"
          checked={isHidden}
          onChange={(e) => setIsHidden(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded-sm focus:ring-blue-500 cursor-pointer"
        />
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-900">
            Скрыть вопрос из общего доступа
          </span>
          <span className="text-[10px] text-gray-500">
            Скрытые вопросы отображаются только в панели администратора
          </span>
        </div>
      </label>
      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2 gap-3 flex-wrap">
        {initialData && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2.5 bg-white border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700 text-sm font-medium rounded-xl transition-all cursor-pointer text-center"
          >
            Удалить вопрос
          </button>
        ) : (
          <div />
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 text-sm font-medium rounded-xl transition-all cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {initialData ? "Сохранить изменения" : "Создать вопрос"}
          </button>
        </div>
      </div>
    </form>
  );
}
