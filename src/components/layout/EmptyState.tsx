import type { ReactNode } from 'react';
import { Button } from '../ui/Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
  className?: string;
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action,
  className = '' 
}: EmptyStateProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center ${className}`}>
      {icon && (
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <Button
          onClick={action.onClick}
          icon={action.icon}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}