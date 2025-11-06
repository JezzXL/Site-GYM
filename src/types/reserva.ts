export type StatusReserva = 'confirmada' | 'cancelada' | 'compareceu' | 'ausente';

export interface Reserva {
  id: string;
  aulaId: string;
  alunoId: string;
  alunoNome: string;
  dataHora: Date;
  status: StatusReserva;
  criadaEm: Date;
  canceladaEm?: Date;
}