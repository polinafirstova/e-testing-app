import { useNavigate } from "react-router";
import Button from "./Button";

interface ErrorMessageProps {
  title?: string;
  message?: string;
}

export default function ErrorMessage({
  title = "Ошибка загрузки",
  message = "Не удалось загрузить данные. Пожалуйста, попробуйте обновить страницу или вернитесь позже.",
}: ErrorMessageProps) {
  const navigate = useNavigate();

  return (
    <div className="page-layout">
      <div className="card-container max-w-md items-center text-center border-red-200 bg-red-50/20 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold text-red-600">{title}</h3>
          <p className="text-sm text-gray-600 leading-snug">{message}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate("/")} fullWidth>
          Вернуться на главную
        </Button>
      </div>
    </div>
  );
}
