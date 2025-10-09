import api from '@/shared/services/api';

// Busca o perfil do aluno logado
const getProfile = () => {
  return api.get('/alunos/me/');
};

// ATENÇÃO: Usaremos PATCH para criar ou atualizar, pois a nossa view no backend é inteligente
const saveProfile = (data: any) => {
  return api.patch('/alunos/me/', data);
};
const getFormOptions = () => {
  return api.get('/form-options/aluno-perfil/').then(res => res.data);
};

export const alunoService = {
  getProfile,
  saveProfile,
  getFormOptions,
};