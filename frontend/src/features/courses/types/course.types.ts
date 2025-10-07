// 1. A "planta" do nosso formulário no React.
//    Define a estrutura e os tipos de dados que o estado `formData` deve ter.
//    Note que está tudo em camelCase, como é a convenção no frontend.
export interface CourseFormData {
  nome: string;
  descricao: string;
  descricaoCurta: string;
  cargaHoraria: number;
  vagasInternas: number;
  vagasExternas: number;
  dataInicioInscricoes: string;
  dataFimInscricoes: string;
  dataInicioCurso: string;
  dataFimCurso: string;
  requisitos: string;
}

// 2. Os valores padrão para um formulário de CRIAÇÃO de curso.
//    O nosso `useCourseForm` vai usar isso como o estado inicial.
//    Usamos "as const" ou tipamos explicitamente para garantir que ele siga a interface.
export const initialCourseFormData: CourseFormData = {
  nome: '',
  descricao: '',
  descricaoCurta: '',
  cargaHoraria: 0,
  vagasInternas: 0,
  vagasExternas: 0,
  dataInicioInscricoes: '',
  dataFimInscricoes: '',
  dataInicioCurso: '',
  dataFimCurso: '',
  requisitos: '',
};

