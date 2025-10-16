import api from '@/shared/services/api';

// Esta interface define a "carga" que o frontend envia para a API ao criar uma inscrição.
// Note que as chaves estão em snake_case, para combinar com o Django.
export interface EnrollmentCreatePayload {
  curso_id: number;
  tipo_vaga: 'INTERNO' | 'EXTERNO';
  matricula: string;
  arquivos: File[];
}

/**
 * Envia uma solicitação para criar uma nova inscrição para o aluno logado.
 * Corresponde à rota: POST /api/inscricoes-aluno/
 * @param data Os dados necessários para criar a inscrição.
 */
const create = (data: EnrollmentCreatePayload) => {
  // --- A MÁGICA DO "PACOTE" ACONTECE AQUI ---

  // 1. Cria um objeto FormData, que é o "pacote" para enviar arquivos.
  const formData = new FormData();

  // 2. Adiciona os campos de texto ao pacote.
  formData.append('curso_id', String(data.curso_id));
  formData.append('tipo_vaga', data.tipo_vaga);
  
  // Adiciona a matrícula SÓ se ela existir (para vagas internas)
  if (data.matricula) {
    formData.append('matricula', data.matricula);
  }
  
  // 3. Adiciona cada arquivo da lista ao pacote.
  //    O nome 'arquivos_upload' DEVE ser o mesmo do campo no serializer do Django.
  if (data.arquivos && data.arquivos.length > 0) {
    data.arquivos.forEach(file => {
      formData.append('arquivos_upload', file);
    });
  }
  
  // 4. Envia o "pacote" (FormData).
  //    O Axios é inteligente e vai setar o Content-Type para 'multipart/form-data' automaticamente.
  return api.post('/inscricoes-aluno/', formData);
};
/**
 * Busca a lista de inscrições do usuário logado (seja aluno ou todas, se for CCA).
 * O backend já cuida da filtragem com base no perfil do usuário.
 * Corresponde à rota: GET /api/inscricoes-aluno/
 */
const listMyEnrollments = () => {
  return api.get('/inscricoes-aluno/');
};


/**
 * Busca a lista de todas as inscrições para um curso específico (para o CCA).
 * @param courseId - O ID do curso a ser filtrado.
 */
const listByCourse = (courseId: string) => {
  return api.get(`/inscricoes-aluno/?curso_id=${courseId}`);
};

const listAllPending = () => {
    // O backend precisa de uma rota que retorne apenas as inscrições com este status
    return api.get('inscricoes-aluno/?status=AGUARDANDO_VALIDACAO');
};

const validate = (enrollmentId: number, isApproved: boolean, reason?: string) => {
  const payload = {
    aprovar: isApproved,
    motivo_recusa: reason || '',
  };
  // Chama a rota da @action 'validar' que criamos no backend
  return api.post(`/inscricoes-aluno/${enrollmentId}/validar/`, payload);
};
// Exporta as funções para que a Store possa usá-las
export const enrollmentService = {
  create,
  listMyEnrollments,
  listByCourse,
  listAllPending,
  validate
};