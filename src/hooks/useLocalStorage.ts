import { useState, useEffect } from 'react';

/**
 * Hook para persistir estado no localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Estado inicial: tenta buscar do localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Erro ao ler do localStorage (${key}):`, error);
      return initialValue;
    }
  });

  // Atualiza localStorage quando o valor muda
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Erro ao salvar no localStorage (${key}):`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue] as const;
}