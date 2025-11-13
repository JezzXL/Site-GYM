// Auth hook
export { useAuth } from './useAuth';

// Toast notifications
export { useToast } from './useToast';
export { useToastContext } from './useToastContext';
export type { Toast, ToastType } from './useToast';

// Aulas hooks
export { 
  useAulas, 
  useAulasInstrutor, 
  useAulasAtivas, 
  useAula 
} from './useAulas';

// Reservas hooks
export {
  useReservas,
  useReservasAtivas,
  useHistorico,
  useAlunosInscritos,
  useReservasStats,
} from './useReservas';

// Utility hooks
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';