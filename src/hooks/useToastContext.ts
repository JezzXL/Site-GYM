import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastProvider';

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext deve ser usado dentro de ToastProvider');
  }
  return context;
}