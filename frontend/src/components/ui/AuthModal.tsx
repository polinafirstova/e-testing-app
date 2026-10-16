import React, { useState } from "react";
import { authenticateAdmin } from "../../services/auth";
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
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 text-sm font-medium rounded-xl transition-all cursor-pointer text-center"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer text-center disabled:opacity-50"
          >
            {loading ? "Вход..." : "Войти"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthModal;
