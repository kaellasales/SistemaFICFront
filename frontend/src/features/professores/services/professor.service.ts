import api from '@/shared/services/api';

const list = () => {

  return api.get('/professor/'); 
};

const getById = (id: string) => {
  return api.get(`/professor/${id}/`);
}

const create = (data: any) => {
    return api.post('/professor/', data);
};

// --- A FERRAMENTA DE ATUALIZAÇÃO ---
const update = (id: string, data: any) => {
    // Usamos PATCH para permitir atualizações parciais (não precisa enviar a senha de novo, por exemplo)
    return api.patch(`/professor/${id}/`, data);
};
export const professorService = {
  list,
  getById,
  create,
  update
};

