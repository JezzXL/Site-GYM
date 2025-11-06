export interface Aula {
  id: string;
  modalidade: string; // Ex: "Yoga", "Funcional", "Cross"
  instrutor: string;
  instrutorId: string;
  diaSemana: number; // 0 = Domingo, 1 = Segunda, etc
  horario: string; // Ex: "18:00"
  duracao: number; // Em minutos
  capacidade: number; // Limite de vagas
  vagasOcupadas: number;
  recorrente: boolean;
  ativa: boolean;
}