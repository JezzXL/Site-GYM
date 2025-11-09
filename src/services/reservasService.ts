import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  limit,
} from 'firebase/firestore';
import type { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from './firebase';
import type { Reserva, CreateReservaDTO, ReservasFiltro, StatusReserva } from '../types';
import { incrementarVagasOcupadas, decrementarVagasOcupadas, hasVagasDisponiveis } from './aulasService';
import { BUSINESS_RULES } from '../utils/constants';

const COLLECTION_NAME = 'reservas';

/**
 * Converte documento do Firestore para Reserva
 */
function docToReserva(doc: DocumentSnapshot<DocumentData>): Reserva {
  const data = doc.data();
  return {
    id: doc.id,
    aulaId: data?.aulaId as string || '',
    alunoId: data?.alunoId as string || '',
    alunoNome: data?.alunoNome as string || '',
    alunoEmail: data?.alunoEmail as string || '',
    dataHora: data?.dataHora?.toDate() || new Date(),
    status: (data?.status as StatusReserva) || 'confirmada',
    criadaEm: data?.criadaEm?.toDate() || new Date(),
    canceladaEm: data?.canceladaEm?.toDate(),
    motivoCancelamento: data?.motivoCancelamento as string | undefined,
  };
}

/**
 * Cria nova reserva
 */
export async function createReserva(data: CreateReservaDTO): Promise<Reserva> {
  try {
    // Verificar se aluno tem vagas disponíveis (máximo 3 ativas)
    const reservasAtivas = await getReservasAtivasByAluno(data.alunoId);
    
    if (reservasAtivas.length >= BUSINESS_RULES.MAX_ACTIVE_RESERVATIONS) {
      throw new Error('Você atingiu o limite de reservas ativas');
    }

    // Verificar se aula tem vagas
    const temVagas = await hasVagasDisponiveis(data.aulaId);
    if (!temVagas) {
      throw new Error('Turma lotada');
    }

    // Verificar se aluno já tem reserva nessa aula
    const jaReservou = await verificarReservaExistente(data.alunoId, data.aulaId, data.dataHora);
    if (jaReservou) {
      throw new Error('Você já possui uma reserva para esta aula');
    }

    // Criar reserva
    const reservaData = {
      aulaId: data.aulaId,
      alunoId: data.alunoId,
      alunoNome: '', // TODO: buscar do contexto ou passar no DTO
      alunoEmail: '', // TODO: buscar do contexto ou passar no DTO
      dataHora: Timestamp.fromDate(data.dataHora),
      status: 'confirmada' as StatusReserva,
      criadaEm: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), reservaData);
    
    // Incrementar vagas ocupadas na aula
    await incrementarVagasOcupadas(data.aulaId);

    const docSnap = await getDoc(docRef);
    return docToReserva(docSnap);
  } catch (error: unknown) {
    console.error('Erro ao criar reserva:', error);
    const errMsg = typeof (error as { message?: unknown }).message === 'string' 
      ? (error as { message: string }).message 
      : 'Erro ao criar reserva';
    throw new Error(errMsg);
  }
}

/**
 * Cancela reserva
 */
export async function cancelReserva(
  id: string,
  motivoCancelamento?: string
): Promise<void> {
  try {
    const reservaRef = doc(db, COLLECTION_NAME, id);
    const reservaSnap = await getDoc(reservaRef);
    
    if (!reservaSnap.exists()) {
      throw new Error('Reserva não encontrada');
    }

    const reserva = docToReserva(reservaSnap);

    // Atualizar reserva
    await updateDoc(reservaRef, {
      status: 'cancelada',
      canceladaEm: Timestamp.now(),
      motivoCancelamento: motivoCancelamento || 'Cancelado pelo aluno',
    });

    // Decrementar vagas ocupadas se estava confirmada
    if (reserva.status === 'confirmada') {
      await decrementarVagasOcupadas(reserva.aulaId);
    }
  } catch (error: unknown) {
    console.error('Erro ao cancelar reserva:', error);
    const errMsg = typeof (error as { message?: unknown }).message === 'string' 
      ? (error as { message: string }).message 
      : 'Erro ao cancelar reserva';
    throw new Error(errMsg);
  }
}

/**
 * Marca presença na aula
 */
export async function marcarPresenca(
  id: string,
  status: 'compareceu' | 'ausente'
): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      status,
    });
  } catch (error) {
    console.error('Erro ao marcar presença:', error);
    throw new Error('Erro ao marcar presença');
  }
}

/**
 * Busca reserva por ID
 */
export async function getReservaById(id: string): Promise<Reserva | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return docToReserva(docSnap);
  } catch (error) {
    console.error('Erro ao buscar reserva:', error);
    throw new Error('Erro ao buscar reserva');
  }
}

/**
 * Busca reservas com filtros
 */
export async function getReservas(filtros?: ReservasFiltro): Promise<Reserva[]> {
  try {
    let q = query(collection(db, COLLECTION_NAME));

    // Aplicar filtros
    if (filtros?.alunoId) {
      q = query(q, where('alunoId', '==', filtros.alunoId));
    }
    
    if (filtros?.aulaId) {
      q = query(q, where('aulaId', '==', filtros.aulaId));
    }
    
    if (filtros?.status) {
      q = query(q, where('status', '==', filtros.status));
    }

    // Ordenar por data mais recente
    q = query(q, orderBy('dataHora', 'desc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToReserva);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    throw new Error('Erro ao buscar reservas');
  }
}

/**
 * Busca reservas ativas do aluno
 */
export async function getReservasAtivasByAluno(alunoId: string): Promise<Reserva[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('alunoId', '==', alunoId),
      where('status', '==', 'confirmada'),
      orderBy('dataHora', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToReserva);
  } catch (error) {
    console.error('Erro ao buscar reservas ativas:', error);
    throw new Error('Erro ao buscar reservas ativas');
  }
}

/**
 * Busca histórico de reservas do aluno
 */
export async function getHistoricoByAluno(
  alunoId: string,
  limitCount: number = 10
): Promise<Reserva[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('alunoId', '==', alunoId),
      where('status', 'in', ['compareceu', 'ausente', 'cancelada']),
      orderBy('dataHora', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToReserva);
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw new Error('Erro ao buscar histórico');
  }
}

/**
 * Busca alunos inscritos em uma aula específica
 */
export async function getAlunosInscritos(
  aulaId: string,
  dataHora: Date
): Promise<Reserva[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('aulaId', '==', aulaId),
      where('dataHora', '==', Timestamp.fromDate(dataHora)),
      where('status', 'in', ['confirmada', 'compareceu', 'ausente'])
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docToReserva);
  } catch (error) {
    console.error('Erro ao buscar alunos inscritos:', error);
    throw new Error('Erro ao buscar alunos inscritos');
  }
}

/**
 * Verifica se aluno já tem reserva nessa aula
 */
async function verificarReservaExistente(
  alunoId: string,
  aulaId: string,
  dataHora: Date
): Promise<boolean> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('alunoId', '==', alunoId),
      where('aulaId', '==', aulaId),
      where('dataHora', '==', Timestamp.fromDate(dataHora)),
      where('status', '==', 'confirmada')
    );

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Erro ao verificar reserva existente:', error);
    return false;
  }
}

/**
 * Conta total de reservas por status
 */
export async function contarReservasPorStatus(alunoId: string): Promise<{
  total: number;
  confirmadas: number;
  canceladas: number;
  compareceu: number;
  ausente: number;
}> {
  try {
    const reservas = await getReservas({ alunoId });
    
    return {
      total: reservas.length,
      confirmadas: reservas.filter(r => r.status === 'confirmada').length,
      canceladas: reservas.filter(r => r.status === 'cancelada').length,
      compareceu: reservas.filter(r => r.status === 'compareceu').length,
      ausente: reservas.filter(r => r.status === 'ausente').length,
    };
  } catch (error) {
    console.error('Erro ao contar reservas:', error);
    throw new Error('Erro ao contar reservas');
  }
}

/**
 * Calcula taxa de presença do aluno
 */
export async function calcularTaxaPresenca(alunoId: string): Promise<number> {
  try {
    const stats = await contarReservasPorStatus(alunoId);
    const totalAulas = stats.compareceu + stats.ausente;
    
    if (totalAulas === 0) return 0;
    
    return Math.round((stats.compareceu / totalAulas) * 100);
  } catch (error) {
    console.error('Erro ao calcular taxa de presença:', error);
    return 0;
  }
}