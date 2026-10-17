import React, { useState } from "react";

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  error,
  onChange,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const isPasswordType = type === "password";
  const currentType = isPasswordType
    ? showPassword
      ? "text"
      : "password"
    : type;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}:
      </label>
      <div className="relative w-full flex items-center">
        <input
          id={id}
          type={currentType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
            isPasswordType ? "pr-11" : ""
          } ${
            error
              ? "border-red-300 focus:ring-red-200 focus:border-red-500"
              : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
          }`}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer select-none p-1 rounded-lg hover:bg-gray-50 flex items-center justify-center"
            title={showPassword ? "Скрыть пароль" : "Показать пароль"}
          >
            {showPassword ? (
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-5.143-5.143m5.143 5.143L10.57 10.57"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://w3.org"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178a1.029 1.012 0 010 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default InputField;
