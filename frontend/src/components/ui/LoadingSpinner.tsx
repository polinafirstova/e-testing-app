interface LoadingSpinnerProps {
  message?: string;
}

function LoadingSpinner({ message = "Загрузка..." }: LoadingSpinnerProps) {
  return (
    <div className="page-layout">
      <div className="flex flex-col items-center gap-4 text-gray-500 font-medium">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="animate-pulse text-sm">{message}</p>
      </div>
    </div>
  );
}

export default LoadingSpinner;
