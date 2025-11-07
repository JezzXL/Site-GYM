export type DiaSemana = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

export type Modalidade = 'Funcional' | 'Yoga' | 'Cross' | 'Pilates' | 'Spinning' | 'Musculação' | 'Dança' | 'Natação';

export interface Aula {
  id: string;
  modalidade: Modalidade | string;
  instrutor: string;
  instrutorId: string;
  diaSemana: DiaSemana;
  horario: string; // Formato: "HH:mm" ex: "18:00"
  duracao: number; // Em minutos
  capacidade: number;
  vagasOcupadas: number;
  recorrente: boolean;
  ativa: boolean;
  descricao?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface AulaDetalhada extends Aula {
  vagasDisponiveis: number;
  percentualOcupacao: number;
  proximasOcorrencias: Date[];
}

export interface CreateAulaDTO {
  modalidade: string;
  instrutorId: string;
  diaSemana: DiaSemana;
  horario: string;
  duracao: number;
  capacidade: number;
  recorrente?: boolean;
  descricao?: string;
}

export interface UpdateAulaDTO {
  modalidade?: string;
  instrutorId?: string;
  diaSemana?: DiaSemana;
  horario?: string;
  duracao?: number;
  capacidade?: number;
  ativa?: boolean;
  descricao?: string;
}

export interface AulasFiltro {
  modalidade?: string;
  instrutor?: string;
  diaSemana?: DiaSemana;
  ativa?: boolean;
}