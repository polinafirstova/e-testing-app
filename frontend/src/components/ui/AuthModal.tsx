import React, { useState } from "react";
import { authenticateAdmin } from "../../services/auth";
import Button from "./Button";
import InputField from "./InputField";

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

function AuthModal({ isOpen, onSuccess, onCancel }: AuthModalProps) {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Введите пароль!");
      return;
    }

    setLoading(true);
    try {
      await authenticateAdmin(password);
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Ошибка входа";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs"
        onClick={onCancel}
      />
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl flex flex-col gap-4 border border-gray-100 animate-in fade-in zoom-in-95 duration-200"
      >
        <div className="text-center flex flex-col gap-1">
          <h3 className="text-base font-bold text-gray-900">
            Вход в панель управления
          </h3>
          <p className="text-xs text-gray-500">
            Доступ разрешен только для преподавателей и администраторов
          </p>
        </div>
        <InputField
          id="admin-password"
          label="Пароль администратора"
          type="password"
          placeholder="••••••••"
          value={password}
          error={error}
          onChange={(e) => {
            setError("");
            setPassword(e.target.value);
          }}
        />
        <div className="flex justify-end gap-3 w-full mt-2">
          <Button variant="secondary" onClick={onCancel} fullWidth>
            Отмена
          </Button>
          <Button variant="primary" type="submit" disabled={loading} fullWidth>
            {loading ? "Вход..." : "Войти"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AuthModal;
