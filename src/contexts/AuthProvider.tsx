import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './authContext';
import type { AuthContextType } from './authContext';
import type { User } from '../types/user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Simulação de login (você pode substituir por uma chamada real de API)
  const login = async (email: string, _password: string) => {
  void _password; // evita aviso do ESLint
  setLoading(true);
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const fakeUser: User = {
      id: '1',
      name: 'Aluno Teste',
      email,
      role: 'aluno',
      createdAt: new Date(),
    };

    setUser(fakeUser);
    localStorage.setItem('user', JSON.stringify(fakeUser));
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (
    name: string,
    email: string,
    _password: string,
    role: 'aluno' = 'aluno'
  ) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newUser: User = {
        id: '2',
        name,
        email,
        role,
        createdAt: new Date(),
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  // Mantém o login ao recarregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
