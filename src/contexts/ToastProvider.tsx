import { createContext } from 'react';
import type { ReactNode } from 'react';
import { useToast } from '../hooks/useToast';
import type { Toast } from '../hooks/useToast';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toastManager = useToast();

  return (
    <ToastContext.Provider value={toastManager}>
      {children}
      
      {/* Container de Toasts */}
      <div className="fixed top-4 right-4 z-9999 flex flex-col gap-3 pointer-events-none">
        {toastManager.toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onClose={() => toastManager.removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

interface ToastItemProps {
  toast: Toast;
  onClose: () => void;
}

function ToastItem({ toast, onClose }: ToastItemProps) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={`
        pointer-events-auto
        min-w-[320px] max-w-md
        p-4 rounded-lg border shadow-lg
        flex items-start gap-3
        animate-slideInRight
        ${styles[toast.type]}
      `}
    >
      <div className="shrink-0 mt-0.5">
        {icons[toast.type]}
      </div>
      
      <div className="flex-1 text-sm font-medium">
        {toast.message}
      </div>
      
      <button
        onClick={onClose}
        className="shrink-0 text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export { ToastContext };
export default ToastProvider;