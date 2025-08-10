import { ENV_CONFIG } from './env';

// Configuração do MongoDB Atlas
export const MONGODB_CONFIG = {
  URI: import.meta.env.VITE_MONGODB_URI || ENV_CONFIG.MONGODB_URI,
  DB_NAME: 'TCC'
};
