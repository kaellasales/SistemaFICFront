// Importa os "moldes" de outras funcionalidades que vamos usar
import { Course } from '@/features/courses/types/course.types';
import { Aluno } from '@/features/alunos/types/aluno.types';

// Define os possíveis status de uma inscrição, espelhando o backend
export type EnrollmentStatus = 
  | 'AGUARDANDO_VALIDACAO' 
  | 'CONFIRMADA' 
  | 'LISTA_ESPERA' 
  | 'CANCELADA';

// A interface principal para um objeto de Inscrição/Matrícula (em camelCase)
export interface Enrollment {
  id: number;
  aluno: Aluno;
  curso: Course;
  status: EnrollmentStatus;
  tipoVaga: 'INTERNO' | 'EXTERNO';
  dataInscricao: string;

  documentos?: { id: number; arquivo: string; nomeOriginal: string }[];
}

export interface EnrollmentCreatePayload {
  curso_id: number;
  tipo_vaga: 'INTERNO' | 'EXTERNO';
  arquivos: File[]; // A lista de arquivos do input de upload
}