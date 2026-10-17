import Button from "./Button";

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
}: ConfirmModalProps) {
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
          <Button variant="secondary" onClick={onCancel} fullWidth>
            Отмена
          </Button>
          <Button variant="primary" onClick={onConfirm} fullWidth>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
