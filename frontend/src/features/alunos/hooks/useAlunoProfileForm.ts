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

// Interface para as opções que virão da API
interface FormOptions {
  sexo: { value: string; label: string }[];
  orgao_expedidor: { value: string; label: string }[];
}

export function useAlunoProfileForm() {
  const navigate = useNavigate();
  const { fetchProfile, saveProfile } = useAlunoStore();
  const { refreshUser } = useAuthStore();

  const [formData, setFormData] = useState<AlunoFormData>(initialAlunoFormData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null);
  const [estados, setEstados] = useState<Estado[]>([]);
  
  // States para as buscas de Município
  const [naturalidadeMunicipios, setNaturalidadeMunicipios] = useState<Municipio[]>([]);
  const [enderecoMunicipios, setEnderecoMunicipios] = useState<Municipio[]>([]);
  const [naturalidadeSearch, setNaturalidadeSearch] = useState('');
  const [enderecoSearch, setEnderecoSearch] = useState('');
  
  const debouncedNaturalidadeSearch = useDebounce(naturalidadeSearch, 500);
  const debouncedEnderecoSearch = useDebounce(enderecoSearch, 500);
  
  // States para as buscas de Estado
  const [ufExpedidorSearch, setUfExpedidorSearch] = useState('');
  const [naturalidadeUfSearch, setNaturalidadeUfSearch] = useState('');
  const [enderecoUfSearch, setEnderecoUfSearch] = useState('');

  // Efeito para buscar os dados iniciais
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [profileResult, optionsResult, estadosResult] = await Promise.allSettled([
          fetchProfile(),
          alunoService.getFormOptions(),
          locationService.getEstados()
        ]);

        let initialData = { ...initialAlunoFormData };

        if (profileResult.status === 'fulfilled' && profileResult.value) {
          initialData = { ...initialData, ...fromSnakeCase(profileResult.value) };
        } else if (profileResult.status === 'rejected' && (profileResult.reason as any).response?.status !== 404) {
          toast.error('Erro ao carregar seu perfil.');
        }
        
        setFormData(initialData);

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
  
  // Efeitos para buscar os municípios
  useEffect(() => {
    const ufId = formData.naturalidadeUf;
    if (ufId) {
      locationService.getMunicipios(ufId, debouncedNaturalidadeSearch).then(setNaturalidadeMunicipios);
    } else {
      setNaturalidadeMunicipios([]);
    }
  }, [formData.naturalidadeUf, debouncedNaturalidadeSearch]);

  useEffect(() => {
    const ufId = formData.enderecoUf;
    if (ufId) {
      locationService.getMunicipios(ufId, debouncedEnderecoSearch).then(setEnderecoMunicipios);
    } else {
      setEnderecoMunicipios([]);
    }
  }, [formData.enderecoUf, debouncedEnderecoSearch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Pega os dados do formulário, excluindo os campos de controle
    const { naturalidadeUf, enderecoUf, ...restOfData } = formData;
    const snakeCaseData = toSnakeCase(restOfData);

    const payload = {
      ...snakeCaseData,
      perfil_confirmado: true,
      
      // Mapeia os campos de ID como o backend espera
      uf_expedidor_id: formData.ufExpedidor,
      naturalidade_id: formData.naturalidade,
      cidade_id: formData.cidade,
    };

    delete payload.uf_expedidor;
    delete payload.naturalidade;
    delete payload.cidade;

    toast.promise(
      saveProfile(payload), 
      {
        loading: 'Salvando seu perfil...',
        success: 'Perfil salvo com sucesso!',
        error: (err: any) => `Ocorreu um erro: ${err.response?.data?.detail || 'Tente novamente.'}`,
      }
    )
    .then(async () => {
      await refreshUser();
      toast('Redirecionando para o painel...', { icon: '🚀' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    })
    .catch((err) => {
      console.error("Falha na operação de salvar perfil:", err);
    })
    .finally(() => {
      setSaving(false);
    });
  };

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
    ufExpedidorSearch,
    setUfExpedidorSearch,
    naturalidadeUfSearch,
    setNaturalidadeUfSearch,
    enderecoUfSearch,
    setEnderecoUfSearch,
    handleChange, 
    handleSubmit 
  };
}