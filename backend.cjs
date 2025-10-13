// Backend Node.js puro para CRUD de veículos no MongoDB com suporte a imagens
// Requer: npm install mongodb multer

const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

const PORT = 500;
const MONGODB_URI = 'mongodb+srv://tccunivap:SomosAmigos@cluster0.u48bk0h.mongodb.net/TCC?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'TCC';
const COLLECTION = 'veiculos';
const IMAGES_COLLECTION = 'images';
const USERS_COLLECTION = 'users';

let db, collection, imagesCollection, usersCollection;

// Configuração do multer para upload de imagens
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas imagens são permitidas'));
    }
  }
});

async function connectDB() {
  if (!db) {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION);
    imagesCollection = db.collection(IMAGES_COLLECTION);
    usersCollection = db.collection(USERS_COLLECTION);
    console.log('Conectado ao MongoDB!');
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 
    'Content-Type': 'application/json', 
    'Access-Control-Allow-Origin': '*', 
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 
    'Access-Control-Allow-Headers': 'Content-Type' 
  });
  res.end(JSON.stringify(data));
}

function sendImage(res, status, data, contentType) {
  res.writeHead(status, { 
    'Content-Type': contentType, 
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=31536000' // Cache por 1 ano
  });
  res.end(data);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  await connectDB();
  const url = new URL(req.url, `http://${req.headers.host}`);

  // Endpoint de teste
  if (req.method === 'GET' && url.pathname === '/teste') {
    return sendJson(res, 200, { ok: true, msg: 'API funcionando' });
  }

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 
      'Access-Control-Allow-Origin': '*', 
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 
      'Access-Control-Allow-Headers': 'Content-Type, Content-Length, Authorization, Accept, Origin, X-Requested-With' 
    });
    return res.end();
  }

  // POST /auth/register - registrar novo usuário
  if (req.method === 'POST' && url.pathname === '/auth/register') {
    const data = await parseBody(req);
    
    if (!data.email || !data.password || !data.name) {
      return sendJson(res, 400, { error: 'Email, senha e nome são obrigatórios' });
    }

    try {
      // Verificar se o usuário já existe
      const existingUser = await usersCollection.findOne({ email: data.email });
      if (existingUser) {
        return sendJson(res, 409, { error: 'Usuário já cadastrado com este email' });
      }

      // Criar UID consistente baseado no email
      const createConsistentUID = (email) => {
        let hash = 0;
        for (let i = 0; i < email.length; i++) {
          const char = email.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash;
        }
        return "user-" + Math.abs(hash).toString();
      };

      const uid = createConsistentUID(data.email);

      // Criar usuário (em produção, a senha deveria ser hasheada)
      const newUser = {
        uid: uid,
        email: data.email,
        password: data.password, // AVISO: Em produção, use bcrypt para hashear
        name: data.name,
        createdAt: new Date()
      };

      await usersCollection.insertOne(newUser);

      // Retornar dados do usuário (sem a senha)
      return sendJson(res, 201, {
        uid: newUser.uid,
        email: newUser.email,
        name: newUser.name
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return sendJson(res, 500, { error: 'Erro interno do servidor' });
    }
  }

  // POST /auth/login - fazer login
  if (req.method === 'POST' && url.pathname === '/auth/login') {
    const data = await parseBody(req);
    
    if (!data.email || !data.password) {
      return sendJson(res, 400, { error: 'Email e senha são obrigatórios' });
    }

    try {
      // Buscar usuário
      const user = await usersCollection.findOne({ email: data.email });
      
      if (!user) {
        return sendJson(res, 401, { error: 'Email ou senha inválidos' });
      }

      // Verificar senha (em produção, use bcrypt.compare)
      if (user.password !== data.password) {
        return sendJson(res, 401, { error: 'Email ou senha inválidos' });
      }

      // Retornar dados do usuário (sem a senha)
      return sendJson(res, 200, {
        uid: user.uid,
        email: user.email,
        name: user.name
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return sendJson(res, 500, { error: 'Erro interno do servidor' });
    }
  }

  // GET /images/:id - serve imagem do MongoDB
  if (req.method === 'GET' && url.pathname.startsWith('/images/')) {
    const id = url.pathname.split('/')[2];
    try {
      const image = await imagesCollection.findOne({ _id: new ObjectId(id) });
      if (!image) {
        return sendJson(res, 404, { error: 'Imagem não encontrada' });
      }
      return sendImage(res, 200, image.data.buffer, image.contentType);
    } catch (error) {
      return sendJson(res, 400, { error: 'ID de imagem inválido' });
    }
  }

  // POST /upload-images - upload de imagens
  if (req.method === 'POST' && url.pathname === '/upload-images') {
    try {
      console.log('Iniciando upload de imagem...');
      console.log('Headers:', req.headers);
      
      // Usar multer diretamente aqui para evitar problemas de compatibilidade
      upload.single('images')(req, res, async (err) => {
        if (err) {
          console.error('Erro do multer:', err);
          return sendJson(res, 400, { error: err.message });
        }
        
        const file = req.file;
        console.log('Arquivo recebido:', file);
        
        if (!file) {
          console.log('Nenhum arquivo recebido');
          return sendJson(res, 400, { error: 'Nenhuma imagem enviada' });
        }

        try {
          console.log('Processando arquivo:', file.originalname, file.mimetype, file.size);
          
          const imageDoc = {
            filename: file.originalname,
            contentType: file.mimetype,
            data: file.buffer,
            size: file.size,
            uploadDate: new Date()
          };
          
          const result = await imagesCollection.insertOne(imageDoc);
          console.log('Imagem salva no MongoDB:', result.insertedId);
          
          const uploadedImage = {
            id: result.insertedId.toString(),
            filename: file.originalname,
            contentType: file.mimetype,
            size: file.size
          };

          console.log('Upload concluído com sucesso');
          return sendJson(res, 201, { 
            message: 'Imagem enviada com sucesso',
            images: [uploadedImage]
          });
        } catch (dbError) {
          console.error('Erro ao salvar no MongoDB:', dbError);
          return sendJson(res, 500, { error: 'Erro interno do servidor' });
        }
      });
      
      // Não retornar aqui, pois o multer vai chamar o callback
      return;
      
    } catch (error) {
      console.error('Erro no upload:', error);
      return sendJson(res, 400, { error: error.message });
    }
  }

  // GET /veiculos - lista todos
  if (req.method === 'GET' && url.pathname === '/veiculos') {
    const veiculos = await collection.find({}).toArray();
    
    // Corrigir URLs das imagens para veículos existentes
    const veiculosCorrigidos = veiculos.map(veiculo => {
      if (veiculo.images && Array.isArray(veiculo.images)) {
        veiculo.images = veiculo.images.map(imgUrl => {
          // Se já é uma URL completa, manter; se não, converter
          if (imgUrl.startsWith('http://')) {
            return imgUrl;
          } else if (imgUrl.startsWith('/images/')) {
            return `http://localhost:500${imgUrl}`;
          } else {
            return `http://localhost:500/images/${imgUrl}`;
          }
        });
      }
      return veiculo;
    });
    
    return sendJson(res, 200, veiculosCorrigidos);
  }

  // GET /veiculos/:id - busca por id
  if (req.method === 'GET' && url.pathname.startsWith('/veiculos/')) {
    const id = url.pathname.split('/')[2];
    try {
      const veiculo = await collection.findOne({ _id: new ObjectId(id) });
      if (!veiculo) return sendJson(res, 404, { error: 'Veículo não encontrado' });
      
      // Corrigir URLs das imagens
      if (veiculo.images && Array.isArray(veiculo.images)) {
        veiculo.images = veiculo.images.map(imgUrl => {
          // Se já é uma URL completa, manter; se não, converter
          if (imgUrl.startsWith('http://')) {
            return imgUrl;
          } else if (imgUrl.startsWith('/images/')) {
            return `http://localhost:500${imgUrl}`;
          } else {
            return `http://localhost:500/images/${imgUrl}`;
          }
        });
      }
      
      return sendJson(res, 200, veiculo);
    } catch {
      return sendJson(res, 400, { error: 'ID inválido' });
    }
  }

  // POST /veiculos - cria novo
  if (req.method === 'POST' && url.pathname === '/veiculos') {
    const data = await parseBody(req);
    if (!data || !data.name) return sendJson(res, 400, { error: 'Dados inválidos' });
    
    // Se houver imagens, converter os IDs para URLs completas (se ainda não forem URLs)
    if (data.images && Array.isArray(data.images)) {
      data.images = data.images.map(imageId => {
        if (imageId.startsWith('http://')) {
          return imageId;
        } else if (imageId.startsWith('/images/')) {
          return `http://localhost:500${imageId}`;
        } else {
          return `http://localhost:500/images/${imageId}`;
        }
      });
    }
    
    const result = await collection.insertOne(data);
    return sendJson(res, 201, { acknowledged: result.acknowledged, insertedId: result.insertedId });
  }

  // PUT /veiculos/:id - atualiza
  if (req.method === 'PUT' && url.pathname.startsWith('/veiculos/')) {
    const id = url.pathname.split('/')[2];
    const data = await parseBody(req);
    try {
      // Se houver imagens, converter os IDs para URLs completas (se ainda não forem URLs)
      if (data.images && Array.isArray(data.images)) {
        data.images = data.images.map(imageId => {
          if (imageId.startsWith('http://')) {
            return imageId;
          } else if (imageId.startsWith('/images/')) {
            return `http://localhost:500${imageId}`;
          } else {
            return `http://localhost:500/images/${imageId}`;
          }
        });
      }
      
      const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: data });
      if (result.matchedCount === 0) return sendJson(res, 404, { error: 'Veículo não encontrado' });
      return sendJson(res, 200, { acknowledged: result.acknowledged });
    } catch {
      return sendJson(res, 400, { error: 'ID inválido' });
    }
  }

  // DELETE /veiculos/:id - remove
  if (req.method === 'DELETE' && url.pathname.startsWith('/veiculos/')) {
    const id = url.pathname.split('/')[2];
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) return sendJson(res, 404, { error: 'Veículo não encontrado' });
      return sendJson(res, 200, { acknowledged: result.acknowledged });
    } catch {
      return sendJson(res, 400, { error: 'ID inválido' });
    }
  }

  // Rota não encontrada
  sendJson(res, 404, { error: 'Rota não encontrada' });
});

server.listen(PORT, () => {
  console.log(`Backend CRUD com suporte a imagens rodando em http://localhost:${PORT}`);
});
