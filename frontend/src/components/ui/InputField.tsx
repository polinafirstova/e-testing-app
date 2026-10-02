import React from "react";

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
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}:
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
          error
            ? "border-red-300 focus:ring-red-200 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-100 focus:border-blue-500"
        }`}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default InputField;
