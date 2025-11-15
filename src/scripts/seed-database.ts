import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// Configuração do Firebase
// IMPORTANTE: Substitua com suas credenciais reais
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,  
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Script para popular o banco com dados de exemplo
 * Execute este arquivo uma vez para criar aulas e reservas de teste
 */

async function seedDatabase() {
  console.log('🌱 Populando banco de dados...');

  try {
    // 1. Criar Aulas
    console.log('📚 Criando aulas...');
    
    const aulas = [
      {
        modalidade: 'Funcional',
        instrutor: 'Carlos Silva',
        instrutorId: 'instrutor1', // Trocar pelo ID real do instrutor
        diaSemana: 'Segunda-feira',
        horario: '18:00',
        duracao: 60,
        capacidade: 10,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'Treino funcional completo',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Yoga',
        instrutor: 'Ana Santos',
        instrutorId: 'instrutor2',
        diaSemana: 'Segunda-feira',
        horario: '07:00',
        duracao: 60,
        capacidade: 8,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'Yoga para iniciantes',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Cross',
        instrutor: 'Pedro Oliveira',
        instrutorId: 'instrutor3',
        diaSemana: 'Terça-feira',
        horario: '19:00',
        duracao: 60,
        capacidade: 15,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'CrossFit de alta intensidade',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Funcional',
        instrutor: 'Carlos Silva',
        instrutorId: 'instrutor1',
        diaSemana: 'Quarta-feira',
        horario: '18:00',
        duracao: 60,
        capacidade: 10,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'Treino funcional completo',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Yoga',
        instrutor: 'Ana Santos',
        instrutorId: 'instrutor2',
        diaSemana: 'Quarta-feira',
        horario: '07:00',
        duracao: 60,
        capacidade: 8,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'Yoga para iniciantes',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Cross',
        instrutor: 'Pedro Oliveira',
        instrutorId: 'instrutor3',
        diaSemana: 'Sexta-feira',
        horario: '19:00',
        duracao: 60,
        capacidade: 15,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'CrossFit de alta intensidade',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Pilates',
        instrutor: 'Maria Costa',
        instrutorId: 'instrutor4',
        diaSemana: 'Quinta-feira',
        horario: '08:00',
        duracao: 60,
        capacidade: 6,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'Pilates para fortalecimento',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      {
        modalidade: 'Spinning',
        instrutor: 'Rafael Mendes',
        instrutorId: 'instrutor5',
        diaSemana: 'Terça-feira',
        horario: '06:00',
        duracao: 45,
        capacidade: 20,
        vagasOcupadas: 0,
        recorrente: true,
        ativa: true,
        descricao: 'Spinning matinal',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    ];

    const aulasRef = collection(db, 'aulas');
    const aulaIds: string[] = [];

    for (const aula of aulas) {
      const docRef = await addDoc(aulasRef, aula);
      aulaIds.push(docRef.id);
      console.log(`✅ Aula criada: ${aula.modalidade} - ${aula.diaSemana} ${aula.horario}`);
    }

    console.log(`\n✅ ${aulas.length} aulas criadas com sucesso!`);
    console.log('\n📝 IDs das aulas criadas:');
    aulaIds.forEach((id, index) => {
      console.log(`   ${index + 1}. ${id} - ${aulas[index].modalidade}`);
    });

    console.log('\n🎉 Banco populado com sucesso!');
    console.log('\n📌 Próximos passos:');
    console.log('   1. Faça login na aplicação');
    console.log('   2. Vá para o Calendário (/calendario)');
    console.log('   3. Reserve uma aula clicando em "Reservar"');
    console.log('   4. Veja suas reservas em "Minhas Reservas"');

  } catch (error) {
    console.error('❌ Erro ao popular banco:', error);
  }
}

// Executar o script
seedDatabase();

// ====================================
// INSTRUÇÕES DE USO:
// ====================================
// 
// 1. Crie o arquivo: src/scripts/seed-database.ts
// 2. Cole este código
// 3. Execute: npx ts-node src/scripts/seed-database.ts
// 
// OU adicione no package.json:
// "scripts": {
//   "seed": "ts-node src/scripts/seed-database.ts"
// }
// 
// E execute: npm run seed
//
// ====================================