import api from '../../../shared/services/api';

// Esta interface define os dados que o Mestre de Obras envia para o Django
interface CourseApiPayload {
  nome: string;
  descricao: string;
  descricao_curta: string;
  carga_horaria: number;
  vagas_internas: number;
  vagas_externas: number;
  data_inicio_inscricoes: string;
  data_fim_inscricoes: string;
  data_inicio_curso: string;
  data_fim_curso: string;
  requisitos: string;
}

// Função para criar um novo curso
const create = (data: CourseApiPayload) => {
  return api.post('/cursos/', data);
};

// Função para atualizar um curso existente
const update = (id: string, data: CourseApiPayload) => {
  return api.put(`/cursos/${id}/`, data);
};

// Função para buscar os dados de um curso (para a página de edição)
const getById = (id: string) => {
  return api.get(`/cursos/${id}/`);
};

export const cursoService = {
  create,
  update,
  getById,
};