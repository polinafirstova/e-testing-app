import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import ErrorMessage from "../components/ui/ErrorMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import type { SystemLog } from "../interfaces/SystemLog";
import { loadSystemLogs } from "../services/logs";

function AdminLogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadSystemLogs()
      .then((data) => setLogs(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return <ErrorMessage title="Ошибка журнала" message={error} />;
  }

  if (loading) {
    return <LoadingSpinner message="Загрузка журнала логирования..." />;
  }

  return (
    <div className="page-layout justify-start py-12">
      <div className="card-container max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Журнал логирования
            </h2>
            <p className="text-sm text-gray-500">
              Протоколирование системных событий и действий пользователей в
              JSON-файл
            </p>
          </div>
          <Button variant="secondary" onClick={() => navigate("/admin")}>
            ← Назад в меню
          </Button>
        </div>
        <div className="mt-4 overflow-x-auto w-full border border-gray-200 rounded-2xl shadow-xs bg-white">
          {logs.length === 0 ? (
            <p className="text-xs text-gray-500 font-medium italic text-center py-8">
              Журнал пуст
            </p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="p-4 w-44">Дата и время</th>
                  <th className="p-4 w-24">Статус</th>
                  <th className="p-4">Действие / Событие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs font-medium text-gray-700">
                {logs.map((log, idx) => {
                  const logDate = new Date(log.timestamp);
                  const displayDate = logDate.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  });
                  const displayTime = logDate.toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const isError = log.level === "error";
                  const isWarn = log.level === "warn";
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-gray-50/60 transition-colors"
                    >
                      <td className="p-4 whitespace-nowrap text-gray-500 font-semibold">
                        {displayDate}{" "}
                        <span className="text-gray-900 ml-1">
                          {displayTime}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase tracking-wide border ${
                            isError
                              ? "bg-red-50 text-red-600 border-red-100"
                              : isWarn
                                ? "bg-amber-50 text-amber-600 border-amber-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="p-4 max-w-md leading-relaxed wrap-break-word text-gray-600">
                        <span className="text-gray-950 font-bold mr-1">
                          [{log.context || "sys"}]:
                        </span>
                        {log.message}
                        {log.error && (
                          <span className="block text-[11px] text-red-500 font-semibold mt-0.5">
                            Детали: {log.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLogsPage;
