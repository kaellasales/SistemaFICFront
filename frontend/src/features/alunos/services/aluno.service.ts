import api from '@/shared/services/api';

// Busca o perfil do aluno LOGADO
const getProfile = () => {
  return api.get('/aluno/me/');
};

// Salva o perfil do aluno LOGADO
const saveProfile = (data: any) => {
  return api.patch('/aluno/me/', data);
};

// Busca as opções para os selects do formulário
const getFormOptions = () => {
  return api.get('/form-options/aluno-perfil/').then(res => res.data);
};

// --- A NOVA FUNÇÃO PARA O CCA ---
/**
 * Busca o perfil completo de um aluno específico pelo seu ID.
 * Usado pelo CCA na tela de análise de dossiê.
 * @param alunoId - O ID do aluno a ser buscado.
 */
const getById = (alunoId: number) => {
  return api.get(`/alunos/${alunoId}/`);
};


// Exporta TODAS as funções
export const alunoService = {
  getProfile,
  saveProfile,
  getFormOptions,
  getById, 
};