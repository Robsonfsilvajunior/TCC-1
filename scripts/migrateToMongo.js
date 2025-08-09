// Script para migrar dados do Firebase Firestore para MongoDB Atlas
// Execute este script após configurar o MongoDB Atlas

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { MongoClient, ServerApiVersion } from "mongodb";

// Configuração do Firebase (mantenha a mesma do seu projeto)
const firebaseConfig = {
  apiKey: "AIzaSyAcezCC5NxaxcxI_RTMpV22Xxse6_tPSEg",
  authDomain: "drive-32767.firebaseapp.com",
  projectId: "drive-32767",
  storageBucket: "drive-32767.appspot.com",
  messagingSenderId: "794458175139",
  appId: "1:794458175139:web:54cc07dd926be8cc15f116",
};

// Configuração do MongoDB (substitua pela sua string de conexão)
const MONGODB_URI = "mongodb+srv://tccunivap:SomosAmigos@cluster0.u48bk0h.mongodb.net/TCC?retryWrites=true&w=majority&appName=Cluster0";

async function migrateData() {
  try {
    console.log("Iniciando migração...");

    // Conectar ao Firebase
    const firebaseApp = initializeApp(firebaseConfig);
    const firestore = getFirestore(firebaseApp);

    // Conectar ao MongoDB
    const mongoClient = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await mongoClient.connect();
    const db = mongoClient.db("TCC");
    const vehiclesCollection = db.collection("veiculos");

    console.log("Conectado aos bancos de dados");

    // Buscar todos os veículos do Firebase
    const vehiclesSnapshot = await getDocs(collection(firestore, "vehicles"));
    const vehicles = [];

    vehiclesSnapshot.forEach((doc) => {
      vehicles.push({
        _id: doc.id, // Manter o mesmo ID
        ...doc.data(),
        created: doc.data().created?.toDate() || new Date(), // Converter timestamp
      });
    });

    console.log(`Encontrados ${vehicles.length} veículos no Firebase`);

    if (vehicles.length === 0) {
      console.log("Nenhum veículo encontrado para migrar");
      return;
    }

    // Inserir no MongoDB
    const result = await vehiclesCollection.insertMany(vehicles);
    console.log(`Migrados ${result.insertedCount} veículos para o MongoDB`);

    // Verificar se todos foram migrados
    const mongoVehicles = await vehiclesCollection.find({}).toArray();
    console.log(`Total de veículos no MongoDB: ${mongoVehicles.length}`);

    console.log("Migração concluída com sucesso!");

  } catch (error) {
    console.error("Erro durante a migração:", error);
  } finally {
    // Fechar conexões
    if (mongoClient) {
      await mongoClient.close();
    }
  }
}

// Executar migração
migrateData();
