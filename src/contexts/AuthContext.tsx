import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/user';
import { AuthContext } from './authContext';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const storedUser = localStorage.getItem('gym_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // TODO: Implementar com Firebase/API
    console.log('Login attempt with:', email, password);
    
    const mockUser: User = {
      id: '1',
      name: 'João Silva',
      email,
      role: 'aluno',
      createdAt: new Date(),
    };
    setUser(mockUser);
    localStorage.setItem('gym_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gym_user');
  };

  const register = async (name: string, email: string, password: string, role: 'aluno' = 'aluno') => {
    // TODO: Implementar com Firebase/API
    console.log('Register attempt with:', email, password);
    
    const mockUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
      createdAt: new Date(),
    };
    setUser(mockUser);
    localStorage.setItem('gym_user', JSON.stringify(mockUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}