export type StatusReserva = 'confirmada' | 'cancelada' | 'compareceu' | 'ausente';

export interface Reserva {
  id: string;
  aulaId: string;
  alunoId: string;
  alunoNome: string;
  alunoEmail: string;
  dataHora: Date;
  status: StatusReserva;
  criadaEm: Date;
  canceladaEm?: Date;
  motivoCancelamento?: string;
}

export interface ReservaDetalhada extends Reserva {
  aula: {
    modalidade: string;
    instrutor: string;
    diaSemana: string;
    horario: string;
    duracao: number;
  };
  podeCancelar: boolean;
  horasRestantes?: number;
}

export interface CreateReservaDTO {
  aulaId: string;
  alunoId: string;
  dataHora: Date;
}

export interface CancelReservaDTO {
  reservaId: string;
  motivoCancelamento?: string;
}

export interface MarcarPresencaDTO {
  reservaId: string;
  status: 'compareceu' | 'ausente';
}

export interface ReservasFiltro {
  alunoId?: string;
  aulaId?: string;
  status?: StatusReserva;
  dataInicio?: Date;
  dataFim?: Date;
}

export interface ReservasStats {
  total: number;
  confirmadas: number;
  canceladas: number;
  compareceu: number;
  ausente: number;
  taxaPresenca: number;
  taxaCancelamento: number;
}