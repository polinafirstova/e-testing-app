import type { Question } from "../interfaces/Question";

interface QuestionCardProps {
  question: Question;
  selectedOptionId: number | null;
  onSelectOption: (id: number) => void;
}

function QuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
}: QuestionCardProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg text-gray-800 leading-snug">{question.text}</h3>
      <div className="flex flex-col gap-3">
        {question.options.map((option) => {
          const isChecked = selectedOptionId === option.id;
          return (
            <label
              key={option.id}
              className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                isChecked
                  ? "border-blue-600 bg-blue-50/50 ring-2 ring-blue-100"
                  : "border-gray-200 bg-white hover:bg-gray-50/80"
              }`}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                checked={isChecked}
                onChange={() => onSelectOption(option.id)}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-gray-700 font-medium text-sm">
                {option.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;
