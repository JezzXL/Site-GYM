import type { UserRole, DiaSemana, Modalidade, StatusReserva } from '../types';

/**
 * Cores do projeto
 */
export const COLORS = {
  primary: '#6da67a',
  primaryLight: '#77b885',
  primaryLighter: '#86c28b',
  secondary: '#859987',
  dark: '#4a4857',
  
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  }
} as const;

/**
 * Roles do sistema
 */
export const USER_ROLES: Record<UserRole, string> = {
  aluno: 'Aluno',
  instrutor: 'Instrutor',
  admin: 'Administrador',
} as const;

/**
 * Dias da semana
 */
export const DIAS_SEMANA: DiaSemana[] = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
] as const;

/**
 * Modalidades de aulas
 */
export const MODALIDADES: Modalidade[] = [
  'Funcional',
  'Yoga',
  'Cross',
  'Pilates',
  'Spinning',
  'Musculação',
  'Dança',
  'Natação',
] as const;

/**
 * Status de reserva
 */
export const STATUS_RESERVA: Record<StatusReserva, string> = {
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  compareceu: 'Compareceu',
  ausente: 'Ausente',
} as const;

/**
 * Regras de negócio
 */
export const BUSINESS_RULES = {
  // Tempo mínimo para cancelar reserva (em horas)
  CANCEL_HOURS_BEFORE: 2,
  
  // Limite de reservas ativas por aluno
  MAX_ACTIVE_RESERVATIONS: 3,
  
  // Duração mínima de aula (em minutos)
  MIN_CLASS_DURATION: 30,
  
  // Duração máxima de aula (em minutos)
  MAX_CLASS_DURATION: 180,
  
  // Capacidade mínima de turma
  MIN_CLASS_CAPACITY: 1,
  
  // Capacidade máxima de turma
  MAX_CLASS_CAPACITY: 50,
  
  // Horário de abertura da academia
  OPENING_HOUR: 6,
  
  // Horário de fechamento da academia
  CLOSING_HOUR: 23,
  
  // Tempo para check-in antes da aula (em minutos)
  CHECKIN_MINUTES_BEFORE: 15,
  
  // Número de semanas para gerar aulas recorrentes
  RECURRING_WEEKS: 4,
  
  // Tamanho da senha mínimo
  MIN_PASSWORD_LENGTH: 6,
  
  // Tamanho do nome mínimo
  MIN_NAME_LENGTH: 3,
} as const;

/**
 * Mensagens de erro padrão
 */
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'Este campo é obrigatório',
  INVALID_EMAIL: 'E-mail inválido',
  INVALID_PASSWORD: 'Senha deve ter no mínimo 6 caracteres',
  PASSWORDS_NOT_MATCH: 'As senhas não coincidem',
  INVALID_NAME: 'Nome deve ter no mínimo 3 caracteres',
  INVALID_TIME: 'Horário inválido',
  INVALID_DATE: 'Data inválida',
  MAX_RESERVATIONS: 'Você atingiu o limite de reservas ativas',
  CLASS_FULL: 'Turma lotada',
  CANNOT_CANCEL: 'Não é possível cancelar com menos de 2 horas de antecedência',
  GENERIC_ERROR: 'Ocorreu um erro. Tente novamente.',
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet.',
  UNAUTHORIZED: 'Você não tem permissão para realizar esta ação',
  NOT_FOUND: 'Recurso não encontrado',
} as const;

/**
 * Mensagens de sucesso padrão
 */
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login realizado com sucesso!',
  LOGOUT: 'Logout realizado com sucesso!',
  REGISTER: 'Cadastro realizado com sucesso!',
  PROFILE_UPDATED: 'Perfil atualizado com sucesso!',
  PASSWORD_CHANGED: 'Senha alterada com sucesso!',
  RESERVATION_CREATED: 'Reserva realizada com sucesso!',
  RESERVATION_CANCELLED: 'Reserva cancelada com sucesso!',
  CLASS_CREATED: 'Aula criada com sucesso!',
  CLASS_UPDATED: 'Aula atualizada com sucesso!',
  CLASS_DELETED: 'Aula excluída com sucesso!',
  PRESENCE_MARKED: 'Presença marcada com sucesso!',
} as const;

/**
 * Rotas da aplicação
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/registro',
  
  // Rotas do aluno
  DASHBOARD_ALUNO: '/dashboard',
  CALENDARIO: '/calendario',
  MINHAS_RESERVAS: '/minhas-reservas',
  
  // Rotas do instrutor
  DASHBOARD_INSTRUTOR: '/instrutor',
  
  // Rotas do admin
  DASHBOARD_ADMIN: '/admin',
  
  // Rotas compartilhadas
  PERFIL: '/perfil',
} as const;

/**
 * Configurações de paginação
 */
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

/**
 * Configurações de toast/notificações
 */
export const TOAST_CONFIG = {
  DURATION: 3000, // 3 segundos
  POSITION: 'top-right',
} as const;

/**
 * Breakpoints responsivos (mesmos do Tailwind)
 */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Formatos de data
 */
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  DISPLAY_WITH_TIME: "dd/MM/yyyy 'às' HH:mm",
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm',
} as const;

/**
 * Storage keys
 */
export const STORAGE_KEYS = {
  USER: 'gym_user',
  TOKEN: 'gym_token',
  THEME: 'gym_theme',
} as const;