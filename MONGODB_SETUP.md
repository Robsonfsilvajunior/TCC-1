# Configuração do MongoDB Atlas

Este projeto foi migrado do Firebase Firestore para o MongoDB Atlas. Siga as instruções abaixo para configurar seu banco de dados.

## 1. Criar conta no MongoDB Atlas

1. Acesse [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crie uma conta gratuita ou faça login
3. Crie um novo cluster (recomendado: M0 Free tier)

## 2. Configurar o Cluster

1. **Criar Database:**
   - Nome: `drivex`
   - Collection: `vehicles`

2. **Configurar Network Access:**
   - Vá em "Network Access"
   - Clique em "Add IP Address"
   - Para desenvolvimento, adicione `0.0.0.0/0` (permite acesso de qualquer lugar)
   - Para produção, adicione apenas os IPs necessários

3. **Criar Database User:**
   - Vá em "Database Access"
   - Clique em "Add New Database User"
   - Crie um usuário com senha
   - Role: "Read and write to any database"

## 3. Obter String de Conexão

1. No seu cluster, clique em "Connect"
2. Escolha "Connect your application"
3. Copie a string de conexão
4. Substitua `<password>` pela senha do usuário criado
5. Substitua `<dbname>` por `drivex`

Exemplo:
```
mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/drivex?retryWrites=true&w=majority
```

## 4. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/drivex?retryWrites=true&w=majority
```

## 5. Estrutura do Banco de Dados

### Collection: vehicles

```javascript
{
  _id: ObjectId,
  name: String,           // Nome do veículo
  model: String,          // Modelo
  version: String,        // Versão
  year: String,           // Ano
  km: String,             // Quilometragem
  price: String,          // Preço
  city: String,           // Cidade
  state: String,          // Estado
  whatsapp: String,       // WhatsApp
  description: String,    // Descrição
  gas: String,            // Tipo de combustível
  color: String,          // Cor
  plateEnd: String,       // Final da placa
  transmission: String,   // Transmissão
  ipva: String,           // IPVA
  owner: String,          // Proprietário
  trade: String,          // Aceita troca
  license: String,        // Licenciamento
  armored: String,        // Blindado
  inspections: String,    // Inspeções
  created: Date,          // Data de criação
  vehicleOwner: String,   // Nome do proprietário
  uid: String,            // ID do usuário
  images: Array,          // Array de imagens
  body: String,           // Tipo de carroceria
  searchName: String      // Nome para busca
}
```

## 6. Migração de Dados (Opcional)

Se você já tem dados no Firebase, pode migrá-los usando um script:

```javascript
// Script de migração (execute no console do Firebase)
const vehicles = await getDocs(collection(db, "vehicles"));
const vehiclesData = vehicles.docs.map(doc => ({
  ...doc.data(),
  _id: doc.id
}));

// Salvar no MongoDB
for (const vehicle of vehiclesData) {
  await vehicleService.createVehicle(vehicle);
}
```

## 7. Testando a Conexão

Após configurar, execute o projeto:

```bash
npm run dev
```

Verifique no console se aparece: "Conectado ao MongoDB Atlas"

## 8. Troubleshooting

### Erro de Conexão
- Verifique se a string de conexão está correta
- Confirme se o IP está liberado no Network Access
- Verifique se o usuário e senha estão corretos

### Erro de Timeout
- Verifique sua conexão com a internet
- Tente usar uma conexão mais estável

### Erro de Autenticação
- Verifique se o usuário tem permissões de leitura e escrita
- Confirme se a senha está correta na string de conexão

## 9. Produção

Para produção, considere:

1. **Segurança:**
   - Restrinja IPs no Network Access
   - Use variáveis de ambiente seguras
   - Configure backup automático

2. **Performance:**
   - Configure índices para campos de busca
   - Monitore o uso de recursos
   - Configure alertas

3. **Backup:**
   - Configure backup automático no Atlas
   - Teste restauração regularmente
