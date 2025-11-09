import type { ReactNode } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  onClose?: () => void;
  className?: string;
}

export function Alert({
  children,
  variant = 'info',
  title,
  onClose,
  className = '',
}: AlertProps) {
  const variants = {
    success: {
      container: 'bg-green-50 border-green-200 text-green-700',
      icon: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
      iconColor: 'text-green-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-700',
      icon: <XCircle className="w-5 h-5 flex-shrink-0" />,
      iconColor: 'text-red-500',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-700',
      icon: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
      iconColor: 'text-yellow-500',
    },
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-700',
      icon: <Info className="w-5 h-5 flex-shrink-0" />,
      iconColor: 'text-blue-500',
    },
  };

  const config = variants[variant];

  return (
    <div
      className={`p-4 border rounded-lg flex items-start gap-3 ${config.container} ${className}`}
      role="alert"
    >
      <div className={config.iconColor}>
        {config.icon}
      </div>

      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        <div className="text-sm">
          {children}
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}