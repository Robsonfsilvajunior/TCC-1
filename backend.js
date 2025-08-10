// Backend Node.js puro para CRUD de veículos no MongoDB
// Requer: npm install mongodb

const http = require('http');
const { MongoClient, ObjectId } = require('mongodb');

const PORT = 3001;
const MONGODB_URI = 'mongodb+srv://tccunivap:SomosAmigos@cluster0.u48bk0h.mongodb.net/TCC?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'TCC';
const COLLECTION = 'veiculos';

let db, collection;

async function connectDB() {
  if (!db) {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    collection = db.collection(COLLECTION);
    console.log('Conectado ao MongoDB!');
  }
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
  res.end(JSON.stringify(data));
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

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  // GET /veiculos - lista todos
  if (req.method === 'GET' && url.pathname === '/veiculos') {
    const veiculos = await collection.find({}).toArray();
    return sendJson(res, 200, veiculos);
  }

  // GET /veiculos/:id - busca por id
  if (req.method === 'GET' && url.pathname.startsWith('/veiculos/')) {
    const id = url.pathname.split('/')[2];
    try {
      const veiculo = await collection.findOne({ _id: new ObjectId(id) });
      if (!veiculo) return sendJson(res, 404, { error: 'Veículo não encontrado' });
      return sendJson(res, 200, veiculo);
    } catch {
      return sendJson(res, 400, { error: 'ID inválido' });
    }
  }

  // POST /veiculos - cria novo
  if (req.method === 'POST' && url.pathname === '/veiculos') {
    const data = await parseBody(req);
    if (!data || !data.name) return sendJson(res, 400, { error: 'Dados inválidos' });
    const result = await collection.insertOne(data);
    return sendJson(res, 201, { acknowledged: result.acknowledged, insertedId: result.insertedId });
  }

  // PUT /veiculos/:id - atualiza
  if (req.method === 'PUT' && url.pathname.startsWith('/veiculos/')) {
    const id = url.pathname.split('/')[2];
    const data = await parseBody(req);
    try {
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
  console.log(`Backend CRUD rodando em http://localhost:${PORT}`);
});
