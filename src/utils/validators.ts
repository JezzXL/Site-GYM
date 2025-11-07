import { isValidTimeFormat as checkTimeFormat } from './dateUtils';

/**
 * Valida se um e-mail é válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida senha (mínimo 6 caracteres)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Valida senha forte (mínimo 8 chars, 1 maiúscula, 1 minúscula, 1 número)
 */
export function isStrongPassword(password: string): boolean {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
}

/**
 * Calcula força da senha (0-5)
 */
export function getPasswordStrength(password: string): number {
  let strength = 0;
  
  if (password.length >= 6) strength++;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  
  return strength;
}

/**
 * Valida nome (mínimo 3 caracteres, apenas letras e espaços)
 */
export function isValidName(name: string): boolean {
  const nameRegex = /^[a-zA-ZÀ-ÿ\s]{3,}$/;
  return nameRegex.test(name.trim());
}

/**
 * Valida horário no formato HH:mm (re-exporta de dateUtils)
 */
export function isValidTimeFormat(time: string): boolean {
  return checkTimeFormat(time);
}

/**
 * Valida se horário está dentro do horário de funcionamento (06:00 - 23:00)
 */
export function isValidBusinessHours(time: string): boolean {
  if (!isValidTimeFormat(time)) return false;
  
  const [hours] = time.split(':').map(Number);
  return hours >= 6 && hours <= 23;
}

/**
 * Valida capacidade de turma (1-50)
 */
export function isValidClassCapacity(capacity: number): boolean {
  return capacity >= 1 && capacity <= 50;
}

/**
 * Valida duração de aula (30-180 minutos)
 */
export function isValidClassDuration(duration: number): boolean {
  return duration >= 30 && duration <= 180;
}

/**
 * Valida se campo está vazio
 */
export function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Valida se campo tem tamanho mínimo
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Valida se campo tem tamanho máximo
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Valida se valor é um número válido
 */
export function isValidNumber(value: string | number): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return !isNaN(num) && isFinite(num);
}

/**
 * Valida se valor é um número inteiro positivo
 */
export function isPositiveInteger(value: string | number): boolean {
  const num = typeof value === 'string' ? parseInt(value, 10) : value;
  return Number.isInteger(num) && num > 0;
}

/**
 * Remove espaços extras de uma string
 */
export function sanitizeString(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Valida formulário de login
 */
export function validateLogin(email: string, password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (isEmpty(email)) {
    errors.push('E-mail é obrigatório');
  } else if (!isValidEmail(email)) {
    errors.push('E-mail inválido');
  }
  
  if (isEmpty(password)) {
    errors.push('Senha é obrigatória');
  } else if (!isValidPassword(password)) {
    errors.push('Senha deve ter no mínimo 6 caracteres');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida formulário de registro
 */
export function validateRegister(
  name: string, 
  email: string, 
  password: string, 
  confirmPassword: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (isEmpty(name)) {
    errors.push('Nome é obrigatório');
  } else if (!isValidName(name)) {
    errors.push('Nome deve ter no mínimo 3 caracteres e conter apenas letras');
  }
  
  if (isEmpty(email)) {
    errors.push('E-mail é obrigatório');
  } else if (!isValidEmail(email)) {
    errors.push('E-mail inválido');
  }
  
  if (isEmpty(password)) {
    errors.push('Senha é obrigatória');
  } else if (!isValidPassword(password)) {
    errors.push('Senha deve ter no mínimo 6 caracteres');
  }
  
  if (password !== confirmPassword) {
    errors.push('As senhas não coincidem');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida formulário de criar aula
 */
export function validateCreateClass(
  modalidade: string,
  horario: string,
  duracao: number,
  capacidade: number
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (isEmpty(modalidade)) {
    errors.push('Modalidade é obrigatória');
  }
  
  if (isEmpty(horario)) {
    errors.push('Horário é obrigatório');
  } else if (!isValidTimeFormat(horario)) {
    errors.push('Horário deve estar no formato HH:mm');
  } else if (!isValidBusinessHours(horario)) {
    errors.push('Horário deve estar entre 06:00 e 23:00');
  }
  
  if (!isValidNumber(duracao)) {
    errors.push('Duração inválida');
  } else if (!isValidClassDuration(duracao)) {
    errors.push('Duração deve estar entre 30 e 180 minutos');
  }
  
  if (!isValidNumber(capacidade)) {
    errors.push('Capacidade inválida');
  } else if (!isValidClassCapacity(capacidade)) {
    errors.push('Capacidade deve estar entre 1 e 50 alunos');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida formulário de perfil
 */
export function validateProfile(name: string, email: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (isEmpty(name)) {
    errors.push('Nome é obrigatório');
  } else if (!isValidName(name)) {
    errors.push('Nome deve ter no mínimo 3 caracteres');
  }
  
  if (isEmpty(email)) {
    errors.push('E-mail é obrigatório');
  } else if (!isValidEmail(email)) {
    errors.push('E-mail inválido');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Valida formulário de alterar senha
 */
export function validateChangePassword(
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (isEmpty(currentPassword)) {
    errors.push('Senha atual é obrigatória');
  }
  
  if (isEmpty(newPassword)) {
    errors.push('Nova senha é obrigatória');
  } else if (!isValidPassword(newPassword)) {
    errors.push('Nova senha deve ter no mínimo 6 caracteres');
  }
  
  if (newPassword !== confirmPassword) {
    errors.push('As senhas não coincidem');
  }
  
  if (currentPassword === newPassword) {
    errors.push('Nova senha deve ser diferente da senha atual');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}