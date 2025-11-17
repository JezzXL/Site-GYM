# 🏋️ GymSchedule

Sistema completo de agendamento de aulas para academias, desenvolvido com React, TypeScript e Firebase.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Firebase](https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 📋 Sobre o Projeto

GymSchedule é uma plataforma web moderna para gestão de aulas em academias, permitindo que administradores gerenciem aulas, instrutores e modalidades, enquanto alunos podem visualizar a grade de horários e fazer reservas de forma intuitiva.

### ✨ Principais Funcionalidades

#### Para Alunos:
- 📅 Visualização de grade de aulas por dia da semana
- 🎯 Sistema de reservas com validação de vagas
- 👤 Perfil pessoal com histórico de reservas
- 🔔 Feedback visual de confirmações e erros
- 📱 Interface 100% responsiva (mobile-first)

#### Para Administradores:
- 👑 Painel administrativo completo
- ➕ Criação e edição de aulas (recorrentes ou únicas)
- 👥 Gestão de instrutores e modalidades
- 📊 Dashboard com estatísticas em tempo real
- 🔐 Controle de acesso baseado em roles

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Zustand** - Gerenciamento de estado global
- **React Router DOM** - Navegação entre páginas
- **Tailwind CSS** - Estilização utility-first
- **Lucide React** - Ícones modernos
- **Vite** - Build tool ultrarrápido

### Backend/Infraestrutura
- **Firebase Authentication** - Autenticação de usuários
- **Cloud Firestore** - Banco de dados NoSQL em tempo real
- **Firebase Hosting** - Deploy e hospedagem

### DevOps
- **GitHub Actions** - CI/CD automatizado
- **ESLint** - Linting de código
- **TypeScript Compiler** - Verificação de tipos

## 📁 Estrutura do Projeto

```
gymschedule/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   │   ├── AulaCard.tsx
│   │   ├── Header.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/         # Context API
│   │   └── AuthContext.tsx
│   ├── pages/            # Páginas da aplicação
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Calendario.tsx
│   │   ├── MinhasReservas.tsx
│   │   ├── Perfil.tsx
│   │   └── admin/
│   │       ├── Dashboard.tsx
│   │       ├── GerenciarAulas.tsx
│   │       └── CriarAula.tsx
│   ├── services/         # Serviços e APIs
│   │   ├── firebase.ts
│   │   ├── aulasService.ts
│   │   ├── reservasService.ts
│   │   └── authService.ts
│   ├── scripts/          # Scripts utilitários
│   │   ├── create-admin.ts
│   │   └── seed-database.ts
│   ├── types/            # Definições TypeScript
│   │   └── index.ts
│   ├── utils/            # Funções auxiliares
│   │   └── constants.ts
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Entry point
├── .github/
│   └── workflows/
│       └── firebase-hosting-merge.yml
├── firebase.json         # Configuração Firebase
├── firestore.rules       # Regras de segurança
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Instalação e Configuração

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Firebase

### Passo a Passo

1. **Clone o repositório**
```bash
git clone https://github.com/JezzXL/Site-GYM
cd Site-GYM
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure o Firebase**

Crie um projeto no [Firebase Console](https://console.firebase.google.com/) e habilite:
- Authentication (Email/Password)
- Cloud Firestore
- Hosting (opcional)

4. **Configure as variáveis de ambiente**

Crie um arquivo `src/services/firebase.ts` com suas credenciais:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

5. **Configure as regras do Firestore**

Copie as regras de `firestore.rules` para o Firebase Console.

6. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

Acesse: `http://localhost:5173`

## 🗄️ Configuração do Banco de Dados

### Criar Primeiro Administrador

```bash
# Instale ts-node se ainda não tiver
npm install -D ts-node

# Edite src/scripts/create-admin.ts e mude a senha
# Execute:
npx ts-node src/scripts/create-admin.ts
```

### Popular com Dados de Exemplo

```bash
npx ts-node src/scripts/seed-database.ts
```

Ou adicione ao `package.json`:
```json
"scripts": {
  "create-admin": "ts-node src/scripts/create-admin.ts",
  "seed": "ts-node src/scripts/seed-database.ts"
}
```

## 🎨 Estrutura de Dados

### Collection: `users`
```typescript
{
  name: string;
  email: string;
  role: 'admin' | 'student';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `aulas`
```typescript
{
  modalidade: string;
  instrutor: string;
  instrutorId: string;
  diaSemana: string;
  horario: string;
  duracao: number;
  capacidade: number;
  vagasOcupadas: number;
  recorrente: boolean;
  ativa: boolean;
  descricao?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Collection: `reservas`
```typescript
{
  aulaId: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: 'confirmada' | 'cancelada';
  createdAt: Timestamp;
  canceladaEm?: Timestamp;
}
```

## 🚀 Deploy

### Deploy para Firebase Hosting

1. **Instale o Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Faça login**
```bash
firebase login
```

3. **Inicialize o projeto**
```bash
firebase init hosting
```

4. **Build e deploy**
```bash
npm run build
firebase deploy
```

### CI/CD Automático

O projeto já vem configurado com GitHub Actions. Cada push na branch `main` dispara automaticamente:
- Build do projeto
- Deploy para Firebase Hosting

## 🔐 Segurança

- Autenticação via Firebase Authentication
- Regras de segurança no Firestore
- Proteção de rotas administrativas
- Validação de dados no cliente e servidor
- CORS configurado corretamente

## 📱 Responsividade

O projeto foi desenvolvido com abordagem mobile-first:
- ✅ Smartphones (320px+)
- ✅ Tablets (768px+)
- ✅ Desktops (1024px+)
- ✅ Telas grandes (1440px+)

## 🧪 Testes

```bash
# Rodar linter
npm run lint

# Type checking
npm run type-check
```

## 📈 Próximas Melhorias

- [ ] Notificações push para lembretes de aulas
- [ ] Sistema de check-in via QR Code
- [ ] Relatórios e analytics avançados
- [ ] Integração com calendário (Google Calendar)
- [ ] App mobile nativo (React Native)
- [ ] Sistema de avaliação de aulas
- [ ] Modo offline com sync

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga estes passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 👤 Autor

**JezzXL**

- GitHub: [@JezzXL](https://github.com/JezzXL)
- LinkedIn: [davydwillianp](https://www.linkedin.com/in/davydwillianp/)
- Email: davydsantos.gt@gmail.com

## 🙏 Agradecimentos

- [React Documentation](https://react.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- Comunidade open source

---

⭐ Se este projeto te ajudou, considere dar uma estrela!

**Desenvolvido com ❤️ e ☕**