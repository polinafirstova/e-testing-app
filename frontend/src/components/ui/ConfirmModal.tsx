import React from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  error?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  isOpen,
  title = "Подтверждение действия",
  message,
  confirmLabel = "Подтвердить",
  error,
  onConfirm,
  onCancel,
}: ConfirmModalProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-sm bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center text-center gap-5 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col gap-2">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 leading-snug">{message}</p>
        </div>
        {error && (
          <p className="w-full text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100/60 text-left">
            {error}
          </p>
        )}
        <div className="flex justify-center gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-white border border-red-300 hover:border-red-400 text-red-700 hover:text-red-900 text-sm font-medium rounded-xl transition-all cursor-pointer text-center"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors cursor-pointer text-center"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
