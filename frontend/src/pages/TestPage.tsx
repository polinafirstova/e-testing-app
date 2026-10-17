import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import QuestionCard from "../components/QuestionCard";
import Button from "../components/ui/Button";
import ConfirmModal from "../components/ui/ConfirmModal";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { Question } from "../interfaces/Question";
import type { SubmitTestDTO, UserAnswerDTO } from "../interfaces/UserAnswer";
import { loadQuestionsForTest } from "../services/questions";
import { sendTestAnswers } from "../services/results";

function TestPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentName = searchParams.get("student") || "Студент";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswerDTO[]>([]);
  const [error, setError] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    loadQuestionsForTest()
      .then((data) => setQuestions(data))
      .catch((err: Error) => setError(`Ошибка загрузки: ${err.message}`));
  }, []);

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (questions.length === 0) {
    return <LoadingSpinner />;
  }

  const currentQuestion = questions[currentIndex];

  async function handleNext() {
    if (selectedOptionId === null) {
      return;
    }

    const selectedOption = currentQuestion.options.find(
      (option) => option.id === selectedOptionId,
    );

    if (!selectedOption) {
      return;
    }

    const newUserAnswer: UserAnswerDTO = {
      questionId: currentQuestion.id,
      optionId: selectedOptionId,
    };

    const updatedAnswers = [...userAnswers, newUserAnswer];
    setUserAnswers(updatedAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOptionId(null);
    } else {
      setIsSubmitting(true);

      const testDto: SubmitTestDTO = {
        username: studentName,
        answers: updatedAnswers,
      };

      try {
        const response = await sendTestAnswers(testDto);

        navigate(`/results/${response.id}`);
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Не удалось сохранить результаты теста";
        setError(`Ошибка отправки: ${message}`);
        setIsSubmitting(false);
      }
    }
  }

  return (
    <div className="page-layout">
      <div className="w-full max-w-xl flex justify-start mb-2">
        <Button
          variant="secondary"
          onClick={() => setIsModalOpen(true)}
          className="text-xs py-1.5 px-3 bg-gray-100 border-none text-gray-500 hover:text-gray-700 hover:bg-gray-200/80"
        >
          ← Покинуть тест
        </Button>
      </div>
      <div className="card-container">
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Электронное тестирование
          </h2>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">
              Студент: <strong className="text-gray-900">{studentName}</strong>
            </span>
            <span className="font-semibold px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full">
              Вопрос {currentIndex + 1} из {questions.length}
            </span>
          </div>
        </div>
        <QuestionCard
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelectOption={setSelectedOptionId}
        />
        <div className="flex justify-end pt-2">
          <Button
            variant="primary"
            type="button"
            onClick={handleNext}
            disabled={selectedOptionId === null || isSubmitting}
            className="px-6 text-sm"
          >
            {currentIndex + 1 === questions.length
              ? "Завершить тест"
              : "Следующий вопрос"}
          </Button>
        </div>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        title="Прервать тестирование?"
        message="Вы уверены, что хотите выйти? Все ваши ответы будут потеряны."
        confirmLabel="Покинуть"
        onConfirm={() => {
          setIsModalOpen(false);
          navigate("/");
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default TestPage;
