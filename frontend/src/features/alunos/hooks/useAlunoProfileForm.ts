import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAlunoStore } from '../stores/useAlunoStore';
import { useAuthStore } from '@/shared/stores/authStore'; 
import { alunoService } from '../services/aluno.service';
import { locationService, Estado, Municipio } from '@/shared/services/location.service';
import { fromSnakeCase, toSnakeCase } from '@/shared/utils/caseConverter';
import { AlunoFormData, initialAlunoFormData } from '../types/aluno.types';
import { useDebounce } from '@/shared/hooks/useDebounce';

interface FormOptions {
  sexo: { value: string; label: string }[];
  orgao_expedidor: { value: string; label: string }[];
}

export function useAlunoProfileForm(id?: string) {
  const navigate = useNavigate();
  const { fetchProfile, saveProfile } = useAlunoStore();
  const { refreshUser } = useAuthStore();

  const [formData, setFormData] = useState<AlunoFormData>(initialAlunoFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  const [naturalidadeMunicipios, setNaturalidadeMunicipios] = useState<Municipio[]>([]);
  const [enderecoMunicipios, setEnderecoMunicipios] = useState<Municipio[]>([]);
  const [naturalidadeSearch, setNaturalidadeSearch] = useState('');
  const [enderecoSearch, setEnderecoSearch] = useState('');
  
  const debouncedNaturalidadeSearch = useDebounce(naturalidadeSearch, 500);
  const debouncedEnderecoSearch = useDebounce(enderecoSearch, 500);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [profileResult, optionsResult, estadosResult] = await Promise.allSettled([
          fetchProfile(),
          alunoService.getFormOptions(),
          locationService.getEstados()
        ]);

        let initialData = { ...initialAlunoFormData };

        // Passo 1: Preenche o formulário com dados do perfil, se existirem
        if (profileResult.status === 'fulfilled' && profileResult.value) {
          initialData = { ...initialData, ...fromSnakeCase(profileResult.value) };
        } else if (profileResult.status === 'rejected' && (profileResult.reason as any).response?.status !== 404) {
          toast.error('Erro ao carregar seu perfil.');
        }
        
        // Passo 2: Define o estado final do formulário de uma só vez
        setFormData(initialData);

        // Passo 3: Preenche os dados dos selects
        if (optionsResult.status === 'fulfilled') {
          setFormOptions(optionsResult.value);
        } else {
          toast.error('Erro ao carregar opções do formulário.');
        }

        if (estadosResult.status === 'fulfilled') {
          setEstados(estadosResult.value);
        } else {
          toast.error('Erro ao carregar a lista de estados.');
        }

      } catch (error) {
        toast.error('Ocorreu um erro inesperado na página.');
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [fetchProfile]);
  
  // Efeito para buscar municípios da NATURALIDADE (quando a UF ou a busca mudam)
  useEffect(() => {
    const ufId = formData.naturalidadeUf;
    if (ufId) {
      locationService.getMunicipios(ufId, debouncedNaturalidadeSearch).then(setNaturalidadeMunicipios);
    } else {
      setNaturalidadeMunicipios([]); // Limpa a lista se nenhum estado estiver selecionado
    }
  }, [formData.naturalidadeUf, debouncedNaturalidadeSearch]);

  // Efeito para buscar municípios do ENDEREÇO (quando a UF ou a busca mudam)
  useEffect(() => {
    const ufId = formData.enderecoUf;
    if (ufId) {
      locationService.getMunicipios(ufId, debouncedEnderecoSearch).then(setEnderecoMunicipios);
    } else {
      setEnderecoMunicipios([]);
    }
  }, [formData.enderecoUf, debouncedEnderecoSearch]);


  // Handler genérico para inputs normais
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // 1. "O Garçom Educado"
    e.preventDefault();
    
    // 2. "A Placa de 'Aguarde'"
    setSaving(true);
    
    // 3. "O Tradutor"
    const snakeCaseData = toSnakeCase(formData);

    // 4. "O Carimbo de Confirmação"
    const payload = {
      ...snakeCaseData,
      perfil_confirmado: true,

      uf_expedidor_id: Number(formData.ufExpedidor),
      naturalidade_id: Number(formData.naturalidade),
      cidade_id: Number(formData.cidade),

      endereco_uf_id: Number(formData.enderecoUf),
      naturalidade_uf_id: Number(formData.naturalidadeUf),
    };

    delete payload.uf_expedidor;
    delete payload.naturalidade;
    delete payload.cidade;
    delete payload.endereco_uf;
    delete payload.naturalidade_uf;

    
      // 5. A Ordem para a Store
      saveProfile(payload), 
      {
        // 6. As Notificações
        loading: 'Salvando seu perfil...',
        success: 'Perfil salvo com sucesso!',
        error: (err) => `Ocorreu um erro: ${err.response?.data?.detail || 'Tente novamente.'}`,
      }
    )
    .then(async () => {
      await refreshUser();
      toast('Redirecionando para o app...', {
        icon: '🚀',
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    })
    .catch((err) => {
      // O toast.promise já mostra o erro na tela, aqui é só para debug
      console.error("Falha na operação de salvar perfil:", err);
    })
    .finally(() => {
      // 9. A Limpeza Final (acontece sempre, com sucesso ou erro)
      setSaving(false);
    });
  };


  // --- O hook retorna TUDO que a página precisa ---
  return { 
    formData, 
    loading, 
    saving, 
    formOptions, 
    estados, 
    naturalidadeMunicipios,
    enderecoMunicipios,
    naturalidadeSearch,
    setNaturalidadeSearch,
    enderecoSearch,
    setEnderecoSearch,
    handleChange, 
    handleSubmit 
  };
}