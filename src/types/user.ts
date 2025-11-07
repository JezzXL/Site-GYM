export type UserRole = 'aluno' | 'instrutor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserStats {
  totalReservas: number;
  aulasRealizadas: number;
  aulasCanceladas: number;
  taxaPresenca: number;
  horasTreino: number;
  sequenciaAtual: number;
  melhorSequencia: number;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}