import { useState } from "react";
import { useNavigate } from "react-router";
import AuthModal from "../components/ui/AuthModal";
import InputField from "../components/ui/InputField";
import { validateName } from "../utils/validateName";

function HomePage() {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>): void {
    setError("");
    setName(e.target.value);
  }

  function handleStart(e: React.SubmitEvent): void {
    e.preventDefault();

    const trimmedName = name.trim();
    const validationError = validateName(trimmedName);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    navigate(`/test?student=${encodeURIComponent(trimmedName)}`);
  }

  return (
    <div className="page-layout">
      <div className="w-full max-w-md flex justify-end mb-2">
        <button
          onClick={() => setIsAuthOpen(true)}
          className="text-xs font-semibold text-gray-500 hover:text-blue-600 bg-white border border-gray-200 hover:border-blue-200 px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-xs"
        >
          Панель управления
        </button>
      </div>
      <div className="card-container max-w-md">
        <div className="flex flex-col gap-1 text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Электронное тестирование
          </h1>
          <p className="text-sm text-gray-600">
            Чтобы начать тест, введите, пожалуйста, свое имя
          </p>
        </div>
        <form onSubmit={handleStart} className="flex flex-col gap-5">
          <InputField
            id="student-name"
            label="Ваше имя"
            placeholder="Имя"
            value={name}
            error={error}
            onChange={handleChangeName}
          />
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors cursor-pointer text-center"
          >
            Начать тестирование
          </button>
        </form>
      </div>
      <AuthModal
        isOpen={isAuthOpen}
        onSuccess={() => {
          setIsAuthOpen(false);
          navigate("/admin", { replace: true });
        }}
        onCancel={() => setIsAuthOpen(false)}
      />
    </div>
  );
}

export default HomePage;
