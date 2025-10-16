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

const list = () => {
  return api.get('/cursos/');
};

const getById = (id: string) => {
  return api.get(`/cursos/${id}/`);
};

const create = (data: any) => {
  return api.post('/cursos/', data);
};

const update = (id: string, data: any) => {
  return api.patch(`/cursos/${id}/`, data);
};

const deleteCourse = (id: string) => {
  return api.delete(`/cursos/${id}/`);
}

export const cursoService = {
  list,
  getById,
  create,
  update,
  deleteCourse,
};