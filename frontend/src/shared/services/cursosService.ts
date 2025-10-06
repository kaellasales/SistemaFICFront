import api from './api';
import { CourseFormData } from '@/pages/CourseFormPage'; // Reutilize a interface

// Interface para o payload que será enviado para a API (com snake_case)
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
  status: 'RASCUNHO' | 'PUBLICADO';
}

const create = (data: CourseApiPayload) => {
  return api.post('/cursos/', data);
};

const update = (id: string, data: CourseApiPayload) => {
  return api.put(`/cursos/${id}/`, data);
};

const getById = (id: string) => {
  return api.get(`/cursos/${id}/`);
};

// Exporte todas as funções para que a Store possa usá-las
export const cursoService = {
  create,
  update,
  getById,
};