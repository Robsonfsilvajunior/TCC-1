# 🚀 Configuração MongoDB Atlas - DriveX

## ✅ Status: Configurado e Pronto!

Sua string de conexão do MongoDB Atlas foi configurada corretamente:

```
mongodb+srv://tccunivap:SomosAmigos@cluster0.u48bk0h.mongodb.net/TCC?retryWrites=true&w=majority&appName=Cluster0
```

## 📋 Próximos Passos:

### 1. **Criar o Database no MongoDB Atlas**
1. Acesse seu cluster no MongoDB Atlas
2. Clique em "Browse Collections"
3. Clique em "Create Database"
4. Database Name: `TCC`
5. Collection Name: `veiculos`
6. Clique em "Create"

### 2. **Configurar Network Access**
1. No menu lateral, clique em "Network Access"
2. Clique em "Add IP Address"
3. Para desenvolvimento, adicione: `0.0.0.0/0`
4. Clique em "Confirm"

### 3. **Testar a Aplicação**
Execute no terminal:
```bash
npm run dev
```

Você deve ver no console: "Conectado ao MongoDB Atlas"

## 🔧 Arquivos Configurados:

- ✅ `src/config/env.ts` - Configurações do MongoDB
- ✅ `src/config/database.ts` - Configurações centralizadas
- ✅ `src/services/mongodbConnection.ts` - Conexão com MongoDB
- ✅ `scripts/migrateToMongo.js` - Script de migração

## 🎯 Funcionalidades Disponíveis:

- ✅ **Criar veículos** - Salva no MongoDB
- ✅ **Listar veículos** - Busca do MongoDB
- ✅ **Buscar veículos** - Pesquisa no MongoDB
- ✅ **Deletar veículos** - Remove do MongoDB
- ✅ **Filtrar por categoria** - Consultas MongoDB

## 🚨 Importante:

1. **Autenticação**: Ainda usa Firebase (login/cadastro)
2. **Imagens**: Ainda usa Firebase Storage
3. **Dados de veículos**: Agora usa MongoDB Atlas

## 🔍 Testando:

1. Acesse: `http://localhost:5173`
2. Faça login/cadastro
3. Tente criar um veículo
4. Verifique se aparece no MongoDB Atlas

## 📊 Estrutura do Banco:

**Database:** `TCC`
**Collection:** `veiculos`

Cada documento terá:
```javascript
{
  _id: ObjectId,
  name: "NOME DO CARRO",
  model: "MODELO",
  version: "VERSÃO",
  year: "2024",
  km: "50000",
  price: "50000",
  city: "São Paulo",
  state: "SP",
  // ... outros campos
  created: Date,
  uid: "ID_DO_USUARIO",
  images: [...]
}
```

## 🆘 Se houver problemas:

1. **Erro de conexão**: Verifique se o IP está liberado
2. **Erro de autenticação**: Verifique usuário/senha
3. **Database não existe**: Crie o database `TCC`
4. **Collection não existe**: Crie a collection `veiculos`

## 🎉 Pronto!

Seu projeto DriveX agora está usando MongoDB Atlas! 🚗💨
