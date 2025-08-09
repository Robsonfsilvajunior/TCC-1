// Script simples para validar a conexão com o MongoDB antes de iniciar o Vite
// Imprime "OK" no terminal em caso de sucesso.

import { MongoClient, ServerApiVersion } from 'mongodb';

const DEFAULT_URI = 'mongodb+srv://tccunivap:SomosAmigos@cluster0.u48bk0h.mongodb.net/TCC?retryWrites=true&w=majority&appName=Cluster0';
const MONGODB_URI = process.env.VITE_MONGODB_URI || DEFAULT_URI;

async function main() {
  let client;
  try {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    // Comando simples para validar a conexão
    await client.db().command({ ping: 1 });

    console.log('OK');
  } catch (err) {
    console.error('Erro ao conectar ao MongoDB:', err?.message || err);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
    }
  }
}

await main();


