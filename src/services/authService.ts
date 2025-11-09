import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User, UserRole, CreateUserDTO, UpdateUserDTO } from '../types';
import { STORAGE_KEYS } from '../utils/constants';

/**
 * Converte FirebaseUser para User do sistema
 */
async function firebaseUserToUser(firebaseUser: FirebaseUser): Promise<User> {
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  const userData = userDoc.data();

  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || userData?.name || '',
    email: firebaseUser.email || '',
    role: userData?.role || 'aluno',
    avatar: firebaseUser.photoURL || userData?.avatar,
    createdAt: userData?.createdAt?.toDate() || new Date(),
    updatedAt: userData?.updatedAt?.toDate(),
  };
}

/**
 * Registra novo usuário
 */
export async function register(data: CreateUserDTO): Promise<User> {
  try {
    // Criar usuário no Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    // Atualizar perfil com nome
    await updateProfile(userCredential.user, {
      displayName: data.name,
    });

    // Criar documento do usuário no Firestore
    const userData = {
      name: data.name,
      email: data.email,
      role: data.role || 'aluno',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    // Retornar usuário formatado
    const user = await firebaseUserToUser(userCredential.user);
    
    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return user;
  } catch (error: unknown) {
    console.error('Erro ao registrar:', error);
    const errCode = typeof (error as { code?: unknown }).code === 'string' ? (error as { code: string }).code : '';
    throw new Error(getAuthErrorMessage(errCode));
  }
}

/**
 * Faz login
 */
export async function login(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = await firebaseUserToUser(userCredential.user);
    
    // Salvar no localStorage
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return user;
  } catch (error: unknown) {
    console.error('Erro ao fazer login:', error);
    const errCode = typeof (error as { code?: unknown }).code === 'string' ? (error as { code: string }).code : '';
    throw new Error(getAuthErrorMessage(errCode));
  }
}

/**
 * Faz logout
 */
export async function logout(): Promise<void> {
  try {
    await signOut(auth);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw new Error('Erro ao fazer logout');
  }
}

/**
 * Atualiza dados do usuário
 */
export async function updateUser(data: UpdateUserDTO): Promise<User> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }

    // Atualizar profile do Firebase Auth
    if (data.name) {
      await updateProfile(currentUser, {
        displayName: data.name,
      });
    }

    if (data.avatar) {
      await updateProfile(currentUser, {
        photoURL: data.avatar,
      });
    }

    // Atualizar documento no Firestore
    await updateDoc(doc(db, 'users', currentUser.uid), {
      ...data,
      updatedAt: new Date(),
    });

    // Retornar usuário atualizado
    const user = await firebaseUserToUser(currentUser);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw new Error('Erro ao atualizar perfil');
  }
}

/**
 * Altera senha do usuário
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      throw new Error('Usuário não autenticado');
    }

    // Reautenticar usuário
    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(currentUser, credential);

    // Atualizar senha
    await updatePassword(currentUser, newPassword);
  } catch (error: unknown) {
    console.error('Erro ao alterar senha:', error);
    const errCode = typeof (error as { code?: unknown }).code === 'string' ? (error as { code: string }).code : '';

    if (errCode === 'auth/wrong-password') {
      throw new Error('Senha atual incorreta');
    }

    throw new Error('Erro ao alterar senha');
  }
}

/**
 * Busca usuário atual
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return null;
    }

    return await firebaseUserToUser(currentUser);
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error);
    return null;
  }
}

/**
 * Atualiza role do usuário (apenas admin)
 */
export async function updateUserRole(userId: string, role: UserRole): Promise<void> {
  try {
    await updateDoc(doc(db, 'users', userId), {
      role,
      updatedAt: new Date(),
    });
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    throw new Error('Erro ao atualizar role do usuário');
  }
}

/**
 * Traduz códigos de erro do Firebase
 */
function getAuthErrorMessage(errorCode: string): string {
  const errors: Record<string, string> = {
    'auth/email-already-in-use': 'Este e-mail já está em uso',
    'auth/invalid-email': 'E-mail inválido',
    'auth/operation-not-allowed': 'Operação não permitida',
    'auth/weak-password': 'Senha muito fraca',
    'auth/user-disabled': 'Usuário desabilitado',
    'auth/user-not-found': 'Usuário não encontrado',
    'auth/wrong-password': 'Senha incorreta',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde',
    'auth/network-request-failed': 'Erro de conexão',
  };

  return errors[errorCode] || 'Erro ao autenticar';
}