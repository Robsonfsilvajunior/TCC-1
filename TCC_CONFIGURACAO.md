# 🎓 TCC - DriveX - Configuração MongoDB Atlas

## 📋 Informações do Projeto

**Nome do Projeto:** TCC - DriveX  
**Database:** TCC  
**Collection:** veiculos  
**Tecnologias:** React + TypeScript + MongoDB Atlas + Firebase

## 🔧 Configuração Atual

### String de Conexão MongoDB Atlas:
```
mongodb+srv://tccunivap:SomosAmigos@cluster0.u48bk0h.mongodb.net/TCC?retryWrites=true&w=majority&appName=Cluster0
```

### Estrutura do Banco de Dados:
- **Database:** `TCC`
- **Collection:** `veiculos`

## 📊 Schema dos Documentos

Cada documento na collection `veiculos` terá a seguinte estrutura:

```javascript
{
  _id: ObjectId,                    // ID único do MongoDB
  name: String,                     // Nome do veículo
  model: String,                    // Modelo
  version: String,                  // Versão
  year: String,                     // Ano
  km: String,                       // Quilometragem
  price: String,                    // Preço
  city: String,                     // Cidade
  state: String,                    // Estado
  whatsapp: String,                 // WhatsApp
  description: String,              // Descrição
  gas: String,                      // Tipo de combustível
  color: String,                    // Cor
  plateEnd: String,                 // Final da placa
  transmission: String,             // Transmissão
  ipva: String,                     // IPVA
  owner: String,                    // Proprietário
  trade: String,                    // Aceita troca
  license: String,                  // Licenciamento
  armored: String,                  // Blindado
  inspections: String,              // Inspeções
  created: Date,                    // Data de criação
  vehicleOwner: String,             // Nome do proprietário
  uid: String,                      // ID do usuário (Firebase)
  images: Array,                    // Array de imagens
  body: String,                     // Tipo de carroceria
  searchName: String                // Nome para busca
}
```

## 🚀 Como Configurar

### 1. MongoDB Atlas
1. Acesse: https://cloud.mongodb.com
2. Faça login com: `tccunivap`
3. Acesse o cluster: `Cluster0`
4. Crie o database: `TCC`
5. Crie a collection: `veiculos`

### 2. Network Access
1. Vá em "Network Access"
2. Adicione IP: `0.0.0.0/0` (desenvolvimento)
3. Clique em "Confirm"

### 3. Executar Projeto
```bash
npm run dev
```

## 🎯 Funcionalidades Implementadas

- ✅ **CRUD Completo** de veículos
- ✅ **Sistema de busca** por nome/modelo
- ✅ **Filtros por categoria** (SUV, Sedan, etc.)
- ✅ **Upload de imagens** (Firebase Storage)
- ✅ **Autenticação** (Firebase Auth)
- ✅ **Interface responsiva** (React + Tailwind)

## 📁 Arquivos Principais

- `src/services/mongodbConnection.ts` - Conexão MongoDB
- `src/config/database.ts` - Configurações
- `src/pages/home/index.tsx` - Listagem de veículos
- `src/pages/dashboard/new/index.tsx` - Criação de veículos
- `src/pages/dashboard/index.tsx` - Dashboard do usuário

## 🔍 Testando a Aplicação

1. **Acesse:** http://localhost:5174
2. **Cadastre-se** ou faça login
3. **Crie um veículo** no dashboard
4. **Verifique** se aparece no MongoDB Atlas

## 📈 Próximos Passos

- [ ] Implementar índices no MongoDB
- [ ] Otimizar consultas
- [ ] Adicionar mais filtros
- [ ] Implementar paginação
- [ ] Adicionar relatórios

## 🎓 TCC - Universidade do Vale do Paraíba

**Aluno:** [Seu Nome]  
**Orientador:** [Nome do Orientador]  
**Curso:** [Nome do Curso]  
**Ano:** 2024

---

*Projeto desenvolvido para o Trabalho de Conclusão de Curso*
