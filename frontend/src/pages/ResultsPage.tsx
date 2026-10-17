import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import ResultQuestionCard from "../components/ResultQuestionCard";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { Question } from "../interfaces/Question";
import type { TestResult } from "../interfaces/UserAnswer";
import { isAuthenticated } from "../services/auth";
import { loadQuestionsForTest } from "../services/questions";
import { loadTestResult } from "../services/results";

function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const resultId = parseInt(id || "", 10);
  const isIdInvalid = isNaN(resultId);

  const [result, setResult] = useState<TestResult | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  const [loading, setLoading] = useState<boolean>(!isIdInvalid);
  const [error, setError] = useState<string>(
    isIdInvalid ? "Некорректный идентификатор результатов тестирования." : "",
  );

  const isAdminUser = isAuthenticated();

  useEffect(() => {
    if (isIdInvalid) return;

    loadTestResult(resultId);
    Promise.all([loadTestResult(resultId), loadQuestionsForTest()])
      .then(([testResultData, questionsData]) => {
        setResult(testResultData);
        setQuestions(questionsData);
      })
      .catch((err: Error) => {
        setError(`Не удалось загрузить результаты: ${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [resultId, isIdInvalid]);

  if (error || isIdInvalid || (!loading && !result)) {
    return (
      <ErrorMessage
        title="Результаты не найдены"
        message={
          error ||
          "Пожалуйста, сначала пройдите тестирование, чтобы увидеть подробный отчет."
        }
      />
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="page-layout">
      <div className="card-container">
        <div className="flex flex-col gap-2 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Результаты тестирования
          </h2>
          <p className="text-sm text-gray-600">
            Студент:{" "}
            <strong className="text-gray-900">{result?.username}</strong>
          </p>
        </div>
        <p className="text-center font-bold text-lg">
          Итоговый результат: {result?.score} из {result?.total} правильных
        </p>
        <div className="flex flex-col gap-4">
          <h4 className="text-base font-semibold text-gray-800">
            Правильные ответы:
          </h4>
          <div className="flex flex-col gap-3">
            {questions.map((question, idx) => {
              const answer = result?.answers.find(
                (ans) => ans.questionId === question.id,
              );
              return (
                <ResultQuestionCard
                  key={question.id}
                  question={question}
                  idx={idx}
                  userAnswerId={answer?.selectedOptionId}
                  correctAnswerId={answer?.correctAnswer}
                />
              );
            })}
          </div>
        </div>
        <div className="flex justify-center pt-2">
          {isAdminUser ? (
            <Button
              variant="secondary"
              onClick={() => navigate("/admin/statistics")}
              className="w-full sm:w-auto text-sm"
            >
              ← Назад в статистику
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => navigate("/")}
              className="w-full sm:w-auto text-sm"
            >
              Пройти тест заново
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
