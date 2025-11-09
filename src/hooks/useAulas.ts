import { useState, useEffect, useCallback } from 'react';
import type { Aula, CreateAulaDTO, UpdateAulaDTO, AulasFiltro } from '../types';
import {
  getAllAulas,
  getAulaById,
  createAula as createAulaService,
  updateAula as updateAulaService,
  deleteAula as deleteAulaService,
  toggleAulaStatus,
  getAulasByInstrutor,
  getAulasAtivas,
} from '../services';

export function useAulas(filtros?: AulasFiltro) {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAulas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllAulas(filtros);
      setAulas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar aulas';
      setError(message);
      console.error('Erro ao buscar aulas:', err);
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    fetchAulas();
  }, [fetchAulas]);

  const createAula = async (data: CreateAulaDTO): Promise<Aula | null> => {
    try {
      setError(null);
      const novaAula = await createAulaService(data);
      setAulas((prev) => [...prev, novaAula]);
      return novaAula;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar aula';
      setError(message);
      console.error('Erro ao criar aula:', err);
      return null;
    }
  };

  const updateAula = async (id: string, data: UpdateAulaDTO): Promise<Aula | null> => {
    try {
      setError(null);
      const aulaAtualizada = await updateAulaService(id, data);
      setAulas((prev) =>
        prev.map((aula) => (aula.id === id ? aulaAtualizada : aula))
      );
      return aulaAtualizada;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar aula';
      setError(message);
      console.error('Erro ao atualizar aula:', err);
      return null;
    }
  };

  const deleteAula = async (id: string): Promise<boolean> => {
    try {
      setError(null);
      await deleteAulaService(id);
      setAulas((prev) => prev.filter((aula) => aula.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao deletar aula';
      setError(message);
      console.error('Erro ao deletar aula:', err);
      return false;
    }
  };

  const toggleStatus = async (id: string, ativa: boolean): Promise<boolean> => {
    try {
      setError(null);
      await toggleAulaStatus(id, ativa);
      setAulas((prev) =>
        prev.map((aula) => (aula.id === id ? { ...aula, ativa } : aula))
      );
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao alterar status';
      setError(message);
      console.error('Erro ao alterar status:', err);
      return false;
    }
  };

  const refresh = useCallback(() => {
    fetchAulas();
  }, [fetchAulas]);

  return {
    aulas,
    loading,
    error,
    createAula,
    updateAula,
    deleteAula,
    toggleStatus,
    refresh,
  };
}

/**
 * Hook para buscar aulas de um instrutor específico
 */
export function useAulasInstrutor(instrutorId: string) {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAulas = useCallback(async () => {
    if (!instrutorId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getAulasByInstrutor(instrutorId);
      setAulas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar aulas do instrutor';
      setError(message);
      console.error('Erro ao buscar aulas do instrutor:', err);
    } finally {
      setLoading(false);
    }
  }, [instrutorId]);

  useEffect(() => {
    fetchAulas();
  }, [fetchAulas]);

  return {
    aulas,
    loading,
    error,
    refresh: fetchAulas,
  };
}

/**
 * Hook para buscar apenas aulas ativas
 */
export function useAulasAtivas() {
  const [aulas, setAulas] = useState<Aula[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAulas = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAulasAtivas();
      setAulas(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao buscar aulas ativas';
      setError(message);
      console.error('Erro ao buscar aulas ativas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAulas();
  }, [fetchAulas]);

  return {
    aulas,
    loading,
    error,
    refresh: fetchAulas,
  };
}

/**
 * Hook para buscar uma aula específica
 */
export function useAula(id: string | null) {
  const [aula, setAula] = useState<Aula | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setAula(null);
      setLoading(false);
      return;
    }

    const fetchAula = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAulaById(id);
        setAula(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao buscar aula';
        setError(message);
        console.error('Erro ao buscar aula:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAula();
  }, [id]);

  return {
    aula,
    loading,
    error,
  };
}