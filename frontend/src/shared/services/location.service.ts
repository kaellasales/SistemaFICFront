import api from './api';

// --- Interfaces para os dados de Localização ---
//    (No futuro, você pode mover estas interfaces para um arquivo em shared/types/)

export interface Estado {
  id: number;
  nome: string;
  uf: string;
}

export interface Municipio {
  id: number;
  nome: string;
}

const getEstados = async (): Promise<Estado[]> => {
  try {
    const response = await api.get('estados/');

    return response.data; 
  } catch (error) {
    console.error("Erro ao buscar estados:", error);
    
    return [];
  }
};

/**
 * Busca a lista de municípios de um estado específico.
 * @param estadoId - O ID do estado para filtrar os municípios.
 * Corresponde à rota: GET /api/municipios/?estado_id=...
 */
const getMunicipios = async (estadoId: number | string, searchTerm?: string): Promise<Municipio[]> => {
  if (!estadoId) return [];
  try {
    // Adiciona o parâmetro 'search' na URL se ele for fornecido
    const params = new URLSearchParams({ estado_id: String(estadoId) });
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    const response = await api.get(`/municipios/?${params.toString()}`);
    return response.data;
  } catch (error) {
    // ...
    return [];
    }
}
// Exporta as funções para serem usadas pela Store ou Hook
export const locationService = {
  getEstados,
  getMunicipios,
};