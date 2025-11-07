import { 
  format, 
  parseISO, 
  differenceInHours, 
  differenceInMinutes,
  addDays,
  addWeeks,
  startOfWeek,
  isBefore,
  isAfter,
  isSameDay,
  setHours,
  setMinutes
} from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Formata uma data para o formato brasileiro (dd/MM/yyyy)
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
}

/**
 * Formata uma data com hora (dd/MM/yyyy HH:mm)
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

/**
 * Formata apenas a hora (HH:mm)
 */
export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'HH:mm');
}

/**
 * Formata data para formato ISO (yyyy-MM-dd)
 */
export function formatDateISO(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Converte string de horário (HH:mm) para Date
 */
export function timeStringToDate(timeString: string, baseDate: Date = new Date()): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  return setMinutes(setHours(baseDate, hours), minutes);
}

/**
 * Combina data e hora em um único objeto Date
 */
export function combineDateAndTime(date: string, time: string): Date {
  const dateObj = parseISO(date);
  const [hours, minutes] = time.split(':').map(Number);
  return setMinutes(setHours(dateObj, hours), minutes);
}

/**
 * Verifica se pode cancelar reserva (2 horas antes)
 */
export function canCancelReservation(aulaDateTime: Date | string): boolean {
  const aulaDate = typeof aulaDateTime === 'string' ? parseISO(aulaDateTime) : aulaDateTime;
  const now = new Date();
  const hoursUntil = differenceInHours(aulaDate, now);
  
  return hoursUntil >= 2;
}

/**
 * Retorna quantas horas faltam para uma aula
 */
export function getHoursUntilClass(aulaDateTime: Date | string): number {
  const aulaDate = typeof aulaDateTime === 'string' ? parseISO(aulaDateTime) : aulaDateTime;
  const now = new Date();
  return differenceInHours(aulaDate, now);
}

/**
 * Retorna quantos minutos faltam para uma aula
 */
export function getMinutesUntilClass(aulaDateTime: Date | string): number {
  const aulaDate = typeof aulaDateTime === 'string' ? parseISO(aulaDateTime) : aulaDateTime;
  const now = new Date();
  return differenceInMinutes(aulaDate, now);
}

/**
 * Verifica se uma aula já passou
 */
export function isClassPast(aulaDateTime: Date | string): boolean {
  const aulaDate = typeof aulaDateTime === 'string' ? parseISO(aulaDateTime) : aulaDateTime;
  return isBefore(aulaDate, new Date());
}

/**
 * Verifica se uma aula está acontecendo agora (15 min antes até fim)
 */
export function isClassHappening(aulaDateTime: Date | string, duration: number = 60): boolean {
  const aulaDate = typeof aulaDateTime === 'string' ? parseISO(aulaDateTime) : aulaDateTime;
  const now = new Date();
  const classEnd = addMinutes(aulaDate, duration);
  const classStart = addMinutes(aulaDate, -15); // 15 min antes
  
  return isAfter(now, classStart) && isBefore(now, classEnd);
}

/**
 * Adiciona minutos a uma data
 */
export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * Gera as próximas N ocorrências de uma aula recorrente
 */
export function generateRecurringClasses(
  diaSemana: number, // 0 = Domingo, 1 = Segunda, etc
  horario: string,
  occurrences: number = 4
): Date[] {
  const dates: Date[] = [];
  const today = new Date();
  let currentDate = startOfWeek(today, { locale: ptBR });
  
  // Ajustar para o dia da semana correto
  while (currentDate.getDay() !== diaSemana) {
    currentDate = addDays(currentDate, 1);
  }
  
  // Gerar as próximas ocorrências
  for (let i = 0; i < occurrences; i++) {
    const classDate = combineDateAndTime(formatDateISO(currentDate), horario);
    
    // Só adiciona se for no futuro
    if (isAfter(classDate, today)) {
      dates.push(classDate);
    }
    
    currentDate = addWeeks(currentDate, 1);
  }
  
  return dates;
}

/**
 * Converte dia da semana (string) para número
 */
export function getDayOfWeekNumber(diaSemana: string): number {
  const dias = {
    'Domingo': 0,
    'Segunda-feira': 1,
    'Terça-feira': 2,
    'Quarta-feira': 3,
    'Quinta-feira': 4,
    'Sexta-feira': 5,
    'Sábado': 6,
  };
  
  return dias[diaSemana as keyof typeof dias] || 0;
}

/**
 * Converte número para dia da semana (string)
 */
export function getDayOfWeekName(dayNumber: number): string {
  const dias = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];
  
  return dias[dayNumber] || 'Segunda-feira';
}

/**
 * Formata data relativa (hoje, amanhã, etc)
 */
export function formatRelativeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  const today = new Date();
  const tomorrow = addDays(today, 1);
  
  if (isSameDay(dateObj, today)) {
    return 'Hoje';
  }
  
  if (isSameDay(dateObj, tomorrow)) {
    return 'Amanhã';
  }
  
  return formatDate(dateObj);
}

/**
 * Calcula duração em formato legível (ex: "1h 30min")
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}

/**
 * Valida se uma string de horário está no formato correto (HH:mm)
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}

/**
 * Valida se uma data está no formato correto (yyyy-MM-dd)
 */
export function isValidDateFormat(date: string): boolean {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  return dateRegex.test(date);
}