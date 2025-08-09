import { ENV_CONFIG } from './env';

// Configuração do MongoDB Atlas
export const MONGODB_CONFIG = {
  URI: import.meta.env.VITE_MONGODB_URI || ENV_CONFIG.MONGODB_URI,
  DB_NAME: 'TCC'
};

// Configuração do Firebase (mantido para autenticação)
export const FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || ENV_CONFIG.FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || ENV_CONFIG.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || ENV_CONFIG.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || ENV_CONFIG.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || ENV_CONFIG.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ENV_CONFIG.FIREBASE_APP_ID,
};
