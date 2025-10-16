
import { User } from '@/shared/types';

export interface Professor {
  id: number;
  user: User; // O objeto de usuário aninhado
  siape: string;
  cpf: string;
  dataNascimento: string;
  totalCourses: number; // A contagem de cursos em camelCase
}