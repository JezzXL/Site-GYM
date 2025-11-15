import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

/**
 * Script para criar um usuário admin
 * Execute este arquivo uma vez para criar o primeiro admin
 */

async function createAdmin() {
  console.log('👑 Criando usuário administrador...');

  const adminData = {
    name: import.meta.env.ADMIN_NAME || 'Administrador',
  email: import.meta.env.ADMIN_EMAIL || 'admin@example.com',
  password: import.meta.env.ADMIN_PASSWORD || 'CHANGE_ME',
  };

  try {
    // 1. Criar usuário no Firebase Authentication
    console.log('📝 Criando usuário no Authentication...');
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      adminData.email,
      adminData.password
    );

    // 2. Atualizar perfil com nome
    await updateProfile(userCredential.user, {
      displayName: adminData.name,
    });

    console.log('✅ Usuário criado no Authentication');
    console.log(`   UID: ${userCredential.user.uid}`);

    // 3. Criar documento do usuário no Firestore
    console.log('📝 Criando documento no Firestore...');
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: adminData.name,
      email: adminData.email,
      role: 'admin', // 👑 ADMIN
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log('✅ Documento criado no Firestore');
    console.log('\n🎉 Admin criado com sucesso!\n');
    console.log('📌 Credenciais:');
    console.log(`   Email: ${adminData.email}`);
    console.log(`   Senha: ${adminData.password}`);
    console.log(`   Role: admin`);
    console.log('\n🔐 Faça login com estas credenciais!');

  } catch (error) {
    console.error('❌ Erro ao criar admin:', error);
    
    if (error instanceof Error && 'code' in error) {
      const firebaseError = error as { code: string };
      if (firebaseError.code === 'auth/email-already-in-use') {
        console.log('\n⚠️  Email já está em uso!');
        console.log('Opções:');
        console.log('1. Use um email diferente');
        console.log('2. Ou mude o role manualmente no Firestore:');
        console.log('   https://console.firebase.google.com/project/testegymsch/firestore/data');
      }
    }
  }
}

// Executar o script
createAdmin();

// ====================================
// INSTRUÇÕES DE USO:
// ====================================
// 
// 1. Crie o arquivo: src/scripts/create-admin.ts
// 2. MUDE A SENHA no código acima (linha 13)
// 3. Execute: npx ts-node src/scripts/create-admin.ts
// 
// OU adicione no package.json:
// "scripts": {
//   "create-admin": "ts-node src/scripts/create-admin.ts"
// }
// 
// E execute: npm run create-admin
//
// ====================================