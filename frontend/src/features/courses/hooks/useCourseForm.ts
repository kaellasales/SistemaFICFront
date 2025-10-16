import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useCourseStore } from '../stores/useCourseStore';
import { toSnakeCase, fromSnakeCase } from '@/shared/utils/caseConverter';

// O "Fiscal" (Zod Schema)
const courseFormSchema = z.object({
  nome: z.string().min(3, 'O nome do curso deve ter pelo menos 3 caracteres.'),
  descricao: z.string().min(10, 'A descrição precisa ser mais detalhada.'),
  descricaoCurta: z.string().optional(),
  cargaHoraria: z.coerce.number().min(1, 'A carga horária é obrigatória.'),
  vagasInternas: z.coerce.number().min(0, 'O nº de vagas deve ser 0 ou mais.'),
  vagasExternas: z.coerce.number().min(0, 'O nº de vagas deve ser 0 ou mais.'),
  dataInicioInscricoes: z.string().min(1, 'A data de início das inscrições é obrigatória.'),
  dataFimInscricoes: z.string().min(1, 'A data final das inscrições é obrigatória.'),
  dataInicioCurso: z.string().min(1, 'A data de início do curso é obrigatória.'),
  dataFimCurso: z.string().min(1, 'A data de término do curso é obrigatória.'),
  requisitos: z.string().optional(),
});

type CourseFormData = z.infer<typeof courseFormSchema>;

export function useCourseForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { createCourse, updateCourse, fetchCourseById } = useCourseStore();
  
  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      nome: '', descricao: '', cargaHoraria: 0, vagasInternas: 0, vagasExternas: 0,
      dataInicioInscricoes: '', dataFimInscricoes: '', dataInicioCurso: '', dataFimCurso: '', requisitos: ''
    }
  });
  
  // Pegamos a função reset de dentro do form para estabilizar a referência
  const { reset } = form;

  useEffect(() => {
    if (isEditing && id) {
      toast.promise(
        fetchCourseById(id).then((course) => {
          const courseData = fromSnakeCase(course);
          // O reset preenche o formulário
          reset({
            ...courseData,
            dataInicioInscricoes: courseData.dataInicioInscricoes?.split('T')[0] || '',
            dataFimInscricoes: courseData.dataFimInscricoes?.split('T')[0] || '',
            dataInicioCurso: courseData.dataInicioCurso?.split('T')[0] || '',
            dataFimCurso: courseData.dataFimCurso?.split('T')[0] || '',
          });
        }),
        {
          loading: 'Carregando dados do curso...',
          success: 'Dados carregados!',
          error: 'Curso não encontrado.',
        }
      ).catch(() => navigate('/my-courses'));
    }
  // <<< A CORREÇÃO PRINCIPAL: REMOVEMOS 'form.reset' E USAMOS 'reset' >>>
  // Isso quebra o ciclo de re-renderização infinito.
  }, [id, isEditing, fetchCourseById, reset, navigate]);

  const onSubmit = async (data: CourseFormData) => {
    const payload = toSnakeCase(data);
    
    const actionPromise = isEditing && id
        ? updateCourse(id, payload)
        : createCourse(payload);

    toast.promise(actionPromise, {
        loading: isEditing ? 'Atualizando curso...' : 'Criando curso...',
        success: `Curso ${isEditing ? 'atualizado' : 'criado'} com sucesso!`,
        error: 'Ocorreu um erro ao salvar o curso.',
    })
    .then(() => navigate('/my-courses'))
    .catch(console.error);
  };

  return { 
    form, 
    isEditing, 
    isLoading: form.formState.isSubmitting || (isEditing && !form.formState.isDirty), 
    onSubmit: form.handleSubmit(onSubmit) 
  };
}