# 🔥 Configuração do Firebase

## 1️⃣ Configurar Regras de Segurança

### Opção A: Via Console (Mais Rápido)

1. Acesse: https://console.firebase.google.com/project/testegymsch/firestore/rules

2. Cole as regras do arquivo `firestore.rules`

3. Clique em **"Publicar"**

### Opção B: Via Firebase CLI

```bash
# Instalar Firebase CLI (se não tiver)
npm install -g firebase-tools

# Login
firebase login

# Inicializar projeto (na raiz do projeto)
firebase init firestore

# Copiar arquivo firestore.rules para a raiz
cp firestore.rules .

# Deploy das regras
firebase deploy --only firestore:rules
```

---

## 2️⃣ Criar Índices

### Opção A: Via Links Automáticos

Quando você vir o erro no console, clique no link fornecido. Exemplo:
```
https://console.firebase.google.com/v1/r/project/testegymsch/firestore/indexes?create_composite=...
```

### Opção B: Via Arquivo JSON

1. Copie o arquivo `firestore.indexes.json` para a raiz do projeto

2. Deploy via CLI:
```bash
firebase deploy --only firestore:indexes
```

### Opção C: Criar Manualmente

Acesse: https://console.firebase.google.com/project/testegymsch/firestore/indexes

Crie os seguintes índices compostos:

#### Índice 1: Aulas Ativas
- **Coleção**: `aulas`
- **Campos**:
  - `ativa` (Ascending)
  - `diaSemana` (Ascending)
  - `horario` (Ascending)

#### Índice 2: Aulas por Instrutor
- **Coleção**: `aulas`
- **Campos**:
  - `instrutorId` (Ascending)
  - `diaSemana` (Ascending)
  - `horario` (Ascending)

#### Índice 3: Reservas Ativas por Aluno
- **Coleção**: `reservas`
- **Campos**:
  - `alunoId` (Ascending)
  - `status` (Ascending)
  - `dataHora` (Ascending)

#### Índice 4: Histórico de Reservas
- **Coleção**: `reservas`
- **Campos**:
  - `alunoId` (Ascending)
  - `status` (Ascending)
  - `dataHora` (Descending)

---

## 3️⃣ Regras de Desenvolvimento (Temporário)

Se quiser testar rapidamente SEM segurança (apenas DEV):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

⚠️ **IMPORTANTE**: Use isso APENAS para desenvolvimento local!

---

## 4️⃣ Verificar Configuração

### Teste no Console:

1. **Firestore Rules**: https://console.firebase.google.com/project/testegymsch/firestore/rules
   - Status deve estar "Publicado"

2. **Firestore Indexes**: https://console.firebase.google.com/project/testegymsch/firestore/indexes
   - Todos os índices devem estar "Enabled" (verde)

### Teste na Aplicação:

```bash
# Rodar aplicação
npm run dev

# Fazer login e testar:
# - Listar aulas ✅
# - Criar reserva ✅
# - Cancelar reserva ✅
# - Ver histórico ✅
```

---

## 5️⃣ Estrutura de Dados

### Collection: `users`
```json
{
  "name": "string",
  "email": "string",
  "role": "aluno | instrutor | admin",
  "avatar": "string?",
  "createdAt": "timestamp",
  "updatedAt": "timestamp?"
}
```

### Collection: `aulas`
```json
{
  "modalidade": "string",
  "instrutor": "string",
  "instrutorId": "string",
  "diaSemana": "string",
  "horario": "string",
  "duracao": "number",
  "capacidade": "number",
  "vagasOcupadas": "number",
  "recorrente": "boolean",
  "ativa": "boolean",
  "descricao": "string?",
  "createdAt": "timestamp",
  "updatedAt": "timestamp?"
}
```

### Collection: `reservas`
```json
{
  "aulaId": "string",
  "alunoId": "string",
  "alunoNome": "string",
  "alunoEmail": "string",
  "dataHora": "timestamp",
  "status": "confirmada | cancelada | compareceu | ausente",
  "criadaEm": "timestamp",
  "canceladaEm": "timestamp?",
  "motivoCancelamento": "string?"
}
```

---

## 🚀 Deploy Rápido

```bash
# 1. Copiar arquivos para raiz
cp firestore.rules .
cp firestore.indexes.json .

# 2. Deploy tudo de uma vez
firebase deploy --only firestore

# 3. Verificar
firebase firestore:indexes
```

---

## 📝 Troubleshooting

### Erro: "Missing or insufficient permissions"
- ✅ Verifique se as regras foram publicadas
- ✅ Verifique se o usuário está autenticado
- ✅ Verifique se o role do usuário está correto no Firestore

### Erro: "The query requires an index"
- ✅ Clique no link fornecido no erro
- ✅ Aguarde 1-2 minutos após criar o índice
- ✅ Recarregue a página

### Erro: "Firebase: Error (auth/...)"
- ✅ Verifique as credenciais no `.env`
- ✅ Verifique se o Authentication está habilitado
- ✅ Verifique os métodos de login habilitados

---

## ✅ Checklist Final

- [ ] Regras publicadas no Firestore
- [ ] Índices criados e ativos (verde)
- [ ] Authentication habilitado (Email/Password)
- [ ] Variáveis de ambiente configuradas (`.env`)
- [ ] Primeiro usuário criado com role correto
- [ ] Teste completo: login → listar → reservar → cancelar

---

## 🆘 Suporte

- Documentação Firebase: https://firebase.google.com/docs
- Console Firebase: https://console.firebase.google.com/project/testegymsch
- Regras: https://firebase.google.com/docs/firestore/security/get-started