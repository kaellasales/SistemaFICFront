import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCourseStore } from '@/features/courses/stores/useCourseStore';
import { fromSnakeCase, toSnakeCase } from '@/shared/utils/caseConverter';

import { CourseFormData, initialCourseFormData } from '@/features/courses/types/course.types'

export function useCourseForm(id?: string) {
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const { createCourse, updateCourse, fetchCourse } = useCourseStore();

  const [formData, setFormData] = useState<CourseFormData>(initialCourseFormData);

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Lógica para carregar os dados do curso quando estiver no modo de edição
    if (isEditing && id) {
      const loadCourse = async (courseId: string) => {
        try {
          const courseDataFromApi = await fetchCourse(courseId);
          const camelCaseData = fromSnakeCase(courseDataFromApi);
          
          setFormData({
            nome: camelCaseData.nome || '',
            descricao: camelCaseData.descricao || '',
            descricaoCurta: camelCaseData.descricaoCurta || '',
            cargaHoraria: camelCaseData.cargaHoraria || 0,
            vagasInternas: camelCaseData.vagasInternas || 0,
            vagasExternas: camelCaseData.vagasExternas || 0,
            dataInicioInscricoes: camelCaseData.dataInicioInscricoes?.split('T')[0] || '',
            dataFimInscricoes: camelCaseData.dataFimInscricoes?.split('T')[0] || '',
            dataInicioCurso: camelCaseData.dataInicioCurso || '',
            dataFimCurso: camelCaseData.dataFimCurso || '',
            requisitos: camelCaseData.requisitos || '',
          });
        } catch (error) {
          toast.error('Erro ao carregar dados do curso.');
          navigate('/my-courses');
        } finally {
          setLoading(false);
        }
      };
      loadCourse(id);
    }
  }, [id, isEditing, fetchCourse, navigate]);

  // Função genérica que atualiza o estado do formulário a cada digitação
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Math.max(0, parseInt(value) || 0) : value,
    }));
  };

  // Função que lida com a submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = toSnakeCase(formData);
    
    const actionPromise = isEditing && id
      ? updateCourse(id, payload)
      : createCourse(payload);

    toast.promise(actionPromise, {
      loading: isEditing ? 'Atualizando curso...' : 'Salvando curso...',
      success: 'Curso salvo com sucesso!',
      error: 'Ocorreu um erro ao salvar o curso.',
    })
    .then(() => navigate('/my-courses'))
    .catch((err) => console.error("Falha na operação:", err))
    .finally(() => setSaving(false));
  };

  // O hook retorna um "pacote" com o estado e as funções para a página usar
  return {
    formData,
    loading,
    saving,
    isEditing,
    handleChange,
    handleSubmit,
  };
}