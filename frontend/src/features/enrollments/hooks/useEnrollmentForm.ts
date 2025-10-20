import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAlunoStore } from '@/features/alunos/stores/useAlunoStore';
import { useEnrollmentStore } from '../stores/useEnrollmentStore';
import { fromSnakeCase } from '@/shared/utils/caseConverter';
import { Aluno } from '@/features/alunos/types/aluno.types';
import { Course } from '@/features/courses/types/course.types';

export interface EnrollmentFormData extends Partial<Aluno> {
  tipoVaga?: 'INTERNO' | 'EXTERNO';
  matricula?: string;
  uploadedFiles?: File[];
}

export function useEnrollmentForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course as Course;

  const { fetchProfile } = useAlunoStore();
  const { createEnrollment } = useEnrollmentStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<EnrollmentFormData>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const totalSteps = 3; // <<< AGORA SÃO 3 PASSOS PARA TODOS

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const profile = await fetchProfile();
        setFormData(fromSnakeCase(profile));
      } catch (error) {
        toast.error("Não foi possível carregar seus dados de perfil.");
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, [fetchProfile]);

  const handleInputChange = (field: keyof EnrollmentFormData, value: string | File[]) => {
    if (field === 'tipoVaga' && value === 'EXTERNO') {
      setFormData(prev => ({ ...prev, [field]: value, matricula: '' }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const nextStep = () => {
    // Validação do Passo 1
    if (currentStep === 1) {
      if (!formData.tipoVaga) {
        toast.error("Por favor, selecione o tipo de vaga para continuar.");
        return;
      }
      if (formData.tipoVaga === 'INTERNO' && !formData.matricula?.trim()) {
        toast.error("Para vaga interna, o número de matrícula ou SIAPE é obrigatório.");
        return;
      }
    }
    // A LÓGICA DE PULAR FOI REMOVIDA
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!course || !formData.tipoVaga) return;
    setIsSubmitting(true);
    
  const payload = {
        curso_id: course.id,
        tipo_vaga: formData.tipoVaga,
        matricula: formData.tipoVaga === 'INTERNO' ? formData.matricula : undefined,
        arquivos: formData.uploadedFiles || []
    };

toast.promise(createEnrollment(payload), {
        loading: 'Enviando sua inscrição...',
        success: 'Inscrição enviada! Um e-mail de confirmação foi enviado para você.',
        error: (err: any) => `Falha: ${err.response?.data?.detail || 'Verifique os dados.'}`,
    })
    .then(() => navigate('/enrollments'))
    .catch(console.error)
    .finally(() => setIsSubmitting(false));
  };

  return {
    course, currentStep, totalSteps, formData, loading, isSubmitting,
    handleInputChange, nextStep, prevStep, handleSubmit
  };
}