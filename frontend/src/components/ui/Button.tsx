import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: ButtonVariant;
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  fullWidth = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  const baseStyles =
    "py-3 px-5 text-sm font-semibold rounded-xl transition-all text-center select-none cursor-pointer focus:outline-none active:scale-[0.98]";

  const variantStyles: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-xs",
    secondary:
      "bg-white border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 shadow-xs",
    danger:
      "bg-white border border-red-200 hover:border-red-300 text-red-600 hover:text-red-700",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed active:scale-100";

  const computedClasses = [
    baseStyles,
    variantStyles[variant],
    fullWidth ? "w-full" : "w-auto sm:w-auto",
    disabled ? disabledStyles : "",
    className,
  ].join(" ");

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={computedClasses}
    >
      {children}
    </button>
  );
}

export default Button;
