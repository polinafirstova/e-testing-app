import { useNavigate } from "react-router";
import Button from "../components/ui/Button";
import { logoutAdmin } from "../services/auth";

function AdminPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: "Банк вопросов",
      description: "Просмотр всех существующих вопросов, включая скрытые",
      path: "/admin/questions",
    },
    {
      title: "Статистика по тесту",
      description: "Сбор статистики ответов студентов",
      path: "/admin/statistics",
    },
    {
      title: "Журнал логирования",
      description: "Просмотр запротоколированных действий пользователей",
      path: "/admin/logs",
    },
  ];

  return (
    <div className="page-layout justify-start py-12">
      <div className="card-container max-w-4xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-gray-100 pb-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-gray-900">
              Панель управления
            </h1>
            <p className="text-sm text-gray-500">
              Добро пожаловать в административный раздел системы электронного
              тестирования
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              logoutAdmin();
              navigate("/");
            }}
            className="self-start sm:self-auto"
          >
            ← На главную
          </Button>
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-base font-bold text-gray-800">
            Доступные модули администрирования
          </h3>
          <div className="flex flex-wrap gap-4">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                onClick={() => navigate(item.path)}
                className="flex-1 min-w-70 p-5 bg-white border border-gray-200 hover:border-blue-400 hover:bg-blue-50/10 rounded-2xl flex flex-col justify-between gap-4 cursor-pointer transition-all duration-200"
              >
                <div className="flex flex-col gap-2">
                  <h4 className="text-base font-bold text-gray-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
