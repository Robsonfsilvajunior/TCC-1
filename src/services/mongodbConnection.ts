// AVISO: Este arquivo foi simplificado para permitir a inicialização do projeto
// no ambiente do navegador sem dependências do driver oficial do MongoDB,
// que só funciona em ambiente Node.js. As integrações reais serão reativadas
// em uma etapa posterior.

// Conexão real com MongoDB ficará em um script Node separado para validação
// de ambiente. Aqui fornecemos um stub mínimo para não quebrar a UI.

export async function connectToDatabase() {
  // Sem-operação no frontend
  return null;
}

export async function getDatabase() {
  // Sem-operação no frontend
  return null as unknown as Record<string, unknown>;
}

export async function closeConnection() {
  // Sem-operação no frontend
}

type AnyRecord = Record<string, any>;

export const vehicleService = {
  async getAllVehicles(): Promise<AnyRecord[]> {
    return [];
  },

  async getVehiclesByUser(_uid: string): Promise<AnyRecord[]> {
    return [];
  },

  async getVehicleById(_id: string): Promise<AnyRecord | null> {
    // Retorna null para que as telas que dependem disso tratem a navegação
    return null;
  },

  async createVehicle(_vehicleData: AnyRecord): Promise<AnyRecord> {
    // Lógica real será implementada depois
    return { acknowledged: true, insertedId: null };
  },

  async deleteVehicle(_id: string): Promise<AnyRecord> {
    return { acknowledged: true, deletedCount: 0 };
  },

  async searchVehicles(_searchTerm: string): Promise<AnyRecord[]> {
    return [];
  },

  async getVehiclesByBodyType(_bodyType: string): Promise<AnyRecord[]> {
    return [];
  }
};
