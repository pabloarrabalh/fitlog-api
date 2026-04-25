import { useToast } from '../../context/ToastContext';

export default function Toast() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            px-4 py-3 rounded-lg shadow-lg text-white flex items-center justify-between gap-3
            animate-in fade-in slide-in-from-top-2 duration-200
            ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                ? 'bg-red-600'
                : toast.type === 'warning'
                ? 'bg-yellow-600'
                : 'bg-blue-600'
            }
          `}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="hover:opacity-80 transition-opacity"
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
