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

const API_URL = 'http://localhost:5000/veiculos';
const IMAGES_API_URL = 'http://localhost:5000';

export const vehicleService = {
  async getAllVehicles(): Promise<any[]> {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Erro ao buscar veículos');
    return res.json();
  },

  async getVehicleById(id: string): Promise<any> {
    const res = await fetch(`${API_URL}/${id}`);
    if (!res.ok) throw new Error('Veículo não encontrado');
    return res.json();
  },

  async createVehicle(vehicleData: object): Promise<any> {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) throw new Error('Erro ao cadastrar veículo');
    return res.json();
  },

  async updateVehicle(id: string, vehicleData: object): Promise<any> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData),
    });
    if (!res.ok) throw new Error('Erro ao atualizar veículo');
    return res.json();
  },

  async deleteVehicle(id: string): Promise<any> {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Erro ao deletar veículo');
    return res.json();
  },

  async uploadImages(files: File[]): Promise<any> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    const res = await fetch(`${IMAGES_API_URL}/upload-images`, {
      method: 'POST',
      body: formData,
    });
    
    if (!res.ok) throw new Error('Erro ao fazer upload das imagens');
    return res.json();
  },

  getImageUrl(imageId: string): string {
    return `${IMAGES_API_URL}/images/${imageId}`;
  },
};
