import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { StatSummary, TestHistoryItem } from "../interfaces/Statistics";
import { loadTestStatistics } from "../services/results";

function AdminStatisticPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<TestHistoryItem[]>([]);
  const [summary, setSummary] = useState<StatSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadTestStatistics()
      .then((data) => {
        setHistory(data.history);
        setSummary(data.summary);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <ErrorMessage title="Ошибка аналитики" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner message="Сбор аналитических данных..." />;
  }

  return (
    <div className="page-layout justify-start py-12">
      <div className="card-container max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Статистика по тесту
            </h2>
            <p className="text-sm text-gray-500">
              Мониторинг успеваемости студентов и результатов тестирования
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/admin")}>
            ← Назад в меню
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 mt-2">
          <div className="flex-1 min-w-45 p-4 bg-gray-50 border border-gray-200/60 rounded-xl flex flex-col gap-1 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Всего прохождений
            </span>
            <span className="text-2xl font-black text-blue-600">
              {summary?.totalPasses}
            </span>
          </div>
          <div className="flex-1 min-w-45 p-4 bg-gray-50 border border-gray-200/60 rounded-xl flex flex-col gap-1 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Средний балл
            </span>
            <span className="text-2xl font-black text-amber-600">
              {summary?.averageScore}
            </span>
          </div>
          <div className="flex-1 min-w-45 p-4 bg-gray-50 border border-gray-200/60 rounded-xl flex flex-col gap-1 text-center">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
              Максимальный результат
            </span>
            <span className="text-2xl font-black text-emerald-600">
              {summary?.maxScore}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-4 mt-4">
          <h3 className="text-base font-bold text-gray-800">
            Журнал сданных тестов:
          </h3>
          {history.length === 0 ? (
            <p className="text-xs text-gray-500 font-medium italic text-center py-6">
              Нет результатов
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.map((item) => {
                const date = new Date(item.createdAt).toLocaleString("ru-RU", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={item.id}
                    onClick={() => navigate(`/results/${item.id}`)}
                    className="flex justify-between items-center p-4 border border-gray-100 bg-white hover:border-blue-300 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold text-gray-950">
                        {item.username}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {date}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1.5 bg-gray-100 text-gray-700 rounded-xl">
                        Балл:{" "}
                        <strong className="text-gray-900">
                          {item.score} / {item.total}
                        </strong>
                      </span>
                      <span className="text-blue-600 text-xs font-bold">
                        Подробнее →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminStatisticPage;
