import { useState } from "react";
import { useNavigate } from "react-router";
import AuthModal from "../components/ui/AuthModal";
import Button from "../components/ui/Button";
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
        <Button
          variant="secondary"
          onClick={() => setIsAuthOpen(true)}
          className="text-xs py-2 px-3 hover:text-blue-600 hover:border-blue-200 flex items-center gap-1"
        >
          Панель управления
        </Button>
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
          <Button type="submit" fullWidth>
            Начать тестирование
          </Button>
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
