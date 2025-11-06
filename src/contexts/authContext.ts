import { createContext } from 'react';
import type { User } from '../types/user';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string, role?: 'aluno') => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);