import api from '@/shared/services/api';

// No futuro, você pode criar um endpoint `/api/dashboard/stats/` que retorna tudo.
// Por agora, vamos buscar a lista de cursos que já temos.
const getCourses = () => {
  return api.get('/cursos/');
};

// As outras estatísticas ainda são locais, mas estão prontas para virar uma chamada de API.
const getStatsForRole = (role: string) => {
  // Mock data para as estatísticas que ainda não vêm da API
  const mockStats = {
    ALUNO: { totalInscricoes: '3', certificados: '1', emAnalise: '2' },
    PROFESSOR: { totalInscricoes: '47', aprovados: '35', pendentes: '12' },
    CCA: { inscricoesPendentes: '156', usuariosAtivos: '342', certificadosEmitidos: '89' },
  };
  return Promise.resolve(mockStats[role] || {});
};

export const dashboardService = {
  getCourses,
  getStatsForRole,
};