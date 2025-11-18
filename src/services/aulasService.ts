import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { DocumentSnapshot, DocumentData } from 'firebase/firestore';
import type { DiaSemana } from '../types';
import { db } from './firebase';
import type { Aula, CreateAulaDTO, UpdateAulaDTO, AulasFiltro } from '../types';

const COLLECTION_NAME = 'aulas';

/**
 * Converte documento do Firestore para Aula
 */
function docToAula(doc: DocumentSnapshot<DocumentData>): Aula {
  const data = doc.data();
  return {
    id: doc.id,
    modalidade: data?.modalidade as string || '',
    instrutor: data?.instrutor as string || '',
    instrutorId: data?.instrutorId as string || '',
    diaSemana: data?.diaSemana as DiaSemana || 'Segunda-feira',
    horario: data?.horario as string || '00:00',
    duracao: (data?.duracao as number) || 0,
    capacidade: (data?.capacidade as number) || 0,
    vagasOcupadas: (data?.vagasOcupadas as number) || 0,
    recorrente: data?.recorrente ?? true,
    ativa: data?.ativa ?? true,
    descricao: data?.descricao as string | undefined,
    createdAt: data?.createdAt?.toDate() || new Date(),
    updatedAt: data?.updatedAt?.toDate(),
  };
}

/**
 * Ordem dos dias da semana para ordenação
 */
const DIAS_ORDEM: Record<string, number> = {
  'Segunda-feira': 1,
  'Terça-feira': 2,
  'Quarta-feira': 3,
  'Quinta-feira': 4,
  'Sexta-feira': 5,
  'Sábado': 6,
  'Domingo': 7,
};

/**
 * Ordena aulas por dia da semana e horário
 */
function sortAulas(aulas: Aula[]): Aula[] {
  return aulas.sort((a, b) => {
    // Primeiro ordena por dia da semana
    const diaA = DIAS_ORDEM[a.diaSemana] || 0;
    const diaB = DIAS_ORDEM[b.diaSemana] || 0;
    
    if (diaA !== diaB) {
      return diaA - diaB;
    }
    
    // Se for o mesmo dia, ordena por horário
    return a.horario.localeCompare(b.horario);
  });
}

/**
 * Cria nova aula
 */
export async function createAula(data: CreateAulaDTO): Promise<Aula> {
  try {
    const aulaData = {
      ...data,
      vagasOcupadas: 0,
      recorrente: data.recorrente !== undefined ? data.recorrente : true,
      ativa: true,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), aulaData);
    const docSnap = await getDoc(docRef);
    
    return docToAula(docSnap);
  } catch (error) {
    console.error('Erro ao criar aula:', error);
    throw new Error('Erro ao criar aula');
  }
}

/**
 * Busca aula por ID
 */
export async function getAulaById(id: string): Promise<Aula | null> {
  try {
    const docSnap = await getDoc(doc(db, COLLECTION_NAME, id));
    
    if (!docSnap.exists()) {
      return null;
    }
    
    return docToAula(docSnap);
  } catch (error) {
    console.error('Erro ao buscar aula:', error);
    throw new Error('Erro ao buscar aula');
  }
}


export async function getAllAulas(filtros?: AulasFiltro): Promise<Aula[]> {
  try {
    let q = query(collection(db, COLLECTION_NAME));

    // Aplicar filtros
    if (filtros?.modalidade) {
      q = query(q, where('modalidade', '==', filtros.modalidade));
    }
    
    if (filtros?.instrutor) {
      q = query(q, where('instrutorId', '==', filtros.instrutor));
    }
    
    if (filtros?.diaSemana) {
      q = query(q, where('diaSemana', '==', filtros.diaSemana));
    }
    
    if (filtros?.ativa !== undefined) {
      q = query(q, where('ativa', '==', filtros.ativa));
    }

  
    const querySnapshot = await getDocs(q);
    const aulas = querySnapshot.docs.map(docToAula);
    
    // Ordenar no cliente (JavaScript) ao invés do Firestore
    return sortAulas(aulas);
  } catch (error) {
    console.error('Erro ao buscar aulas:', error);
    throw new Error('Erro ao buscar aulas');
  }
}

/**
 * Busca aulas por instrutor
 */
export async function getAulasByInstrutor(instrutorId: string): Promise<Aula[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('instrutorId', '==', instrutorId)
    );

    const querySnapshot = await getDocs(q);
    const aulas = querySnapshot.docs.map(docToAula);
    
    return sortAulas(aulas);
  } catch (error) {
    console.error('Erro ao buscar aulas do instrutor:', error);
    throw new Error('Erro ao buscar aulas do instrutor');
  }
}

/**
 * Busca aulas ativas
 */
export async function getAulasAtivas(): Promise<Aula[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('ativa', '==', true)
    );

    const querySnapshot = await getDocs(q);
    const aulas = querySnapshot.docs.map(docToAula);
    
    return sortAulas(aulas);
  } catch (error) {
    console.error('Erro ao buscar aulas ativas:', error);
    throw new Error('Erro ao buscar aulas ativas');
  }
}

/**
 * Atualiza aula
 */
export async function updateAula(id: string, data: UpdateAulaDTO): Promise<Aula> {
  try {
    const aulaRef = doc(db, COLLECTION_NAME, id);
    
    await updateDoc(aulaRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });

    const docSnap = await getDoc(aulaRef);
    return docToAula(docSnap);
  } catch (error) {
    console.error('Erro ao atualizar aula:', error);
    throw new Error('Erro ao atualizar aula');
  }
}

/**
 * Deleta aula
 */
export async function deleteAula(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Erro ao deletar aula:', error);
    throw new Error('Erro ao deletar aula');
  }
}

/**
 * Ativa/Desativa aula
 */
export async function toggleAulaStatus(id: string, ativa: boolean): Promise<void> {
  try {
    await updateDoc(doc(db, COLLECTION_NAME, id), {
      ativa,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Erro ao alterar status da aula:', error);
    throw new Error('Erro ao alterar status da aula');
  }
}

/**
 * Incrementa vagas ocupadas
 */
export async function incrementarVagasOcupadas(id: string): Promise<void> {
  try {
    const aulaRef = doc(db, COLLECTION_NAME, id);
    const aulaSnap = await getDoc(aulaRef);
    
    if (!aulaSnap.exists()) {
      throw new Error('Aula não encontrada');
    }
    
    const aula = docToAula(aulaSnap);
    
    if (aula.vagasOcupadas >= aula.capacidade) {
      throw new Error('Turma lotada');
    }
    
    await updateDoc(aulaRef, {
      vagasOcupadas: aula.vagasOcupadas + 1,
      updatedAt: Timestamp.now(),
    });
  } catch (error: unknown) {
    console.error('Erro ao incrementar vagas:', error);
    const errMsg = typeof (error as { message?: unknown }).message === 'string' ? (error as { message: string }).message : '';
    throw new Error(errMsg || 'Erro ao reservar vaga');
  }
}

/**
 * Decrementa vagas ocupadas
 */
export async function decrementarVagasOcupadas(id: string): Promise<void> {
  try {
    const aulaRef = doc(db, COLLECTION_NAME, id);
    const aulaSnap = await getDoc(aulaRef);
    
    if (!aulaSnap.exists()) {
      throw new Error('Aula não encontrada');
    }
    
    const aula = docToAula(aulaSnap);
    
    if (aula.vagasOcupadas > 0) {
      await updateDoc(aulaRef, {
        vagasOcupadas: aula.vagasOcupadas - 1,
        updatedAt: Timestamp.now(),
      });
    }
  } catch (error) {
    console.error('Erro ao decrementar vagas:', error);
    throw new Error('Erro ao liberar vaga');
  }
}

/**
 * Verifica se tem vagas disponíveis
 */
export async function hasVagasDisponiveis(id: string): Promise<boolean> {
  try {
    const aula = await getAulaById(id);
    if (!aula) return false;
    
    return aula.vagasOcupadas < aula.capacidade;
  } catch (error) {
    console.error('Erro ao verificar vagas:', error);
    return false;
  }
}