import { useState, useEffect, useCallback } from 'react';
import type { Reserva, CreateReservaDTO, ReservasFiltro } from '../types';
import {
  getReservas,
  getReservasAtivasByAluno,
  getHistoricoByAluno,
  createReserva as createReservaService,
  cancelReserva as cancelReservaService,
  marcarPresenca as marcarPresencaService,
  getAlunosInscritos,
  contarReservasPorStatus,
  calcularTaxaPresenca,
} from '../services';

export function useReservas(filtros?: ReservasFiltro) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservas(filtros);
      setReservas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reservas';
      setError(message);
      console.error('Erro ao buscar reservas:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  const createReserva = async (data: CreateReservaDTO): Promise<Reserva | null> => {
    try {
      setError(null);
      const novaReserva = await createReservaService(data);
      setReservas((prev) => [novaReserva, ...prev]);
      return novaReserva;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar reserva';
      setError(message);
      console.error('Erro ao criar reserva:', err);
      throw err; // Re-throw para o componente lidar
    }
  };

  const cancelReserva = async (id: string, motivo?: string): Promise<boolean> => {
    try {
      setError(null);
      await cancelReservaService(id, motivo);
      setReservas((prev) =>
        prev.map((reserva) =>
          reserva.id === id
            ? { ...reserva, status: 'cancelada', canceladaEm: new Date() }
            : reserva
        )
      );
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar reserva';
      setError(message);
      console.error('Erro ao cancelar reserva:', err);
      return false;
    }
  };

  const marcarPresenca = async (
    id: string,
    status: 'compareceu' | 'ausente'
  ): Promise<boolean> => {
    try {
      setError(null);
      await marcarPresencaService(id, status);
      setReservas((prev) =>
        prev.map((reserva) =>
          reserva.id === id ? { ...reserva, status } : reserva
        )
      );
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao marcar presença';
      setError(message);
      console.error('Erro ao marcar presença:', err);
      return false;
    }
  };

  const refresh = useCallback(() => {
    fetchReservas();
  }, [fetchReservas]);

  return {
    reservas,
    loading,
    error,
    createReserva,
    cancelReserva,
    marcarPresenca,
    refresh,
  };
}

/**
 * Hook para buscar reservas ativas de um aluno
 */
export function useReservasAtivas(alunoId: string) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = useCallback(async () => {
    if (!alunoId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getReservasAtivasByAluno(alunoId);
      setReservas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar reservas ativas';
      setError(message);
      console.error('Erro ao buscar reservas ativas:', err);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    fetchReservas();
  }, [fetchReservas]);

  return {
    reservas,
    loading,
    error,
    refresh: fetchReservas,
  };
}

/**
 * Hook para buscar histórico de um aluno
 */
export function useHistorico(alunoId: string, limit: number = 10) {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistorico = useCallback(async () => {
    if (!alunoId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getHistoricoByAluno(alunoId, limit);
      setReservas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar histórico';
      setError(message);
      console.error('Erro ao buscar histórico:', err);
    } finally {
      setLoading(false);
    }
  }, [alunoId, limit]);

  useEffect(() => {
    fetchHistorico();
  }, [fetchHistorico]);

  return {
    reservas,
    loading,
    error,
    refresh: fetchHistorico,
  };
}

/**
 * Hook para buscar alunos inscritos em uma aula
 */
export function useAlunosInscritos(aulaId: string, dataHora: Date) {
  const [alunos, setAlunos] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlunos = useCallback(async () => {
    if (!aulaId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getAlunosInscritos(aulaId, dataHora);
      setAlunos(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar alunos inscritos';
      setError(message);
      console.error('Erro ao buscar alunos inscritos:', err);
    } finally {
      setLoading(false);
    }
  }, [aulaId, dataHora]);

  useEffect(() => {
    fetchAlunos();
  }, [fetchAlunos]);

  return {
    alunos,
    loading,
    error,
    refresh: fetchAlunos,
  };
}

/**
 * Hook para estatísticas de reservas de um aluno
 */
export function useReservasStats(alunoId: string) {
  const [stats, setStats] = useState({
    total: 0,
    confirmadas: 0,
    canceladas: 0,
    compareceu: 0,
    ausente: 0,
    taxaPresenca: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!alunoId) return;

    try {
      setLoading(true);
      setError(null);
      
      const [statusCount, taxa] = await Promise.all([
        contarReservasPorStatus(alunoId),
        calcularTaxaPresenca(alunoId),
      ]);

      setStats({
        ...statusCount,
        taxaPresenca: taxa,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar estatísticas';
      setError(message);
      console.error('Erro ao buscar estatísticas:', err);
    } finally {
      setLoading(false);
    }
  }, [alunoId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh: fetchStats,
  };
}