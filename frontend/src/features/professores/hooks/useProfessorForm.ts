import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useProfessorStore } from '../stores/useProfessorStore';
import { fromSnakeCase } from '@/shared/utils/caseConverter';


const professorFormSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido').refine(email => email.endsWith('@ifce.edu.br'), {
    message: 'Email deve ser institucional (@ifce.edu.br)'
  }),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve ter o formato 000.000.000-00'),
  
  siape: z.string().length(7, 'O SIAPE deve ter 7 dígitos').regex(/^[0-9]+$/, 'SIAPE deve conter apenas números'),
  dataNascimento: z.string().optional(),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => {
  
  if (data.password) {
      return data.password === data.confirmPassword;
  }
  return true; 
}, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type ProfessorFormData = z.infer<typeof professorFormSchema>;

export function useProfessorForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const { createProfessor, updateProfessor, fetchProfessorById } = useProfessorStore();
  
  const form = useForm<ProfessorFormData>({
    resolver: zodResolver(professorFormSchema),
    defaultValues: { /* ... */ }
  });
  
  
  const [loading, setLoading] = useState(isEditing); // Só carrega se estiver no modo de edição

  useEffect(() => {
    // Guarda de segurança extra
    if (isEditing && id) {
      const loadProfessorData = async () => {
        toast.loading("Carregando dados do professor...");
        try {
          console.log(`[useEffect] Tentando buscar professor com ID: ${id}`);
          const professor = await fetchProfessorById(id);
          console.log("[useEffect] SUCESSO! Professor encontrado:", professor);
          
          const profileData = fromSnakeCase(professor);
          form.reset({
            firstName: profileData.user.firstName,
            lastName: profileData.user.lastName,
            email: profileData.user.email,
            cpf: profileData.cpf,
            siape: profileData.siape,
            dataNascimento: profileData.dataNascimento,
          });
          toast.dismiss();
          toast.success("Dados carregados!");
        } catch (error) {
          // <<< A PARTE MAIS IMPORTANTE >>>
          console.error("🕵️‍♂️ ERRO DETALHADO NA BUSCA:", error);
          toast.dismiss();
          // Mostra uma mensagem de erro mais útil
          const errorMessage = (error as any).response?.data?.detail || "Professor não encontrado. Verifique a URL e as permissões.";
          toast.error(errorMessage);
          
          // <<< O PILOTO AUTOMÁTICO DESATIVADO >>>
          // A gente COMENTA a linha abaixo para a página NÃO recarregar.
          // navigate('/professores');
        }
      };
      loadProfessorData();
    }
  }, [id, isEditing, fetchProfessorById, form.reset, navigate]);
  
  const onSubmit = async (data: ProfessorFormData) => {
    const payload = {
      user: {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        password: data.password,
      },
      siape: data.siape,
      cpf: data.cpf,
      data_nascimento: data.dataNascimento,
    };
    
    const actionPromise = isEditing && id
        ? updateProfessor(id, payload)
        : createProfessor(payload);

    toast.promise(actionPromise, {
        loading: isEditing ? 'Atualizando professor...' : 'Cadastrando professor...',
        success: `Professor ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`,
        error: 'Ocorreu um erro ao salvar.',
    })
    .then(() => navigate('/professores'))
    .catch(console.error);
  };

  return { form, isEditing, isLoading: form.formState.isSubmitting, onSubmit: form.handleSubmit(onSubmit) };
}